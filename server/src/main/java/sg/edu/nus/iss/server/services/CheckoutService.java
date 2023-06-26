package sg.edu.nus.iss.server.services;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

import jakarta.transaction.Transactional;
import sg.edu.nus.iss.server.models.Customer;
import sg.edu.nus.iss.server.models.Order;
import sg.edu.nus.iss.server.models.OrderItem;
import sg.edu.nus.iss.server.models.Payment;
import sg.edu.nus.iss.server.models.Purchase;
import sg.edu.nus.iss.server.models.PurchaseConfirmation;
import sg.edu.nus.iss.server.repositories.CustomerRepository;

@Service
public class CheckoutService {

    private static final String CREDIT_CARD_STATEMENT_DISPLAY = "HWZ PURCHASE";
    private final List<String> availablePaymentMethods = new ArrayList<>(Arrays.asList("card"));
    private CustomerRepository customerRepository;

    public CheckoutService(CustomerRepository customerRepository, @Value("${stripe.secret.key}") String stripeSecretKey) {
        this.customerRepository = customerRepository;
        Stripe.apiKey = stripeSecretKey; // initialize Stripe API
    }

    @Transactional
    public PurchaseConfirmation placeOrder(Purchase purchase) {

        Order order = purchase.getOrder();

        // generate random orderId
        String orderId = UUID.randomUUID().toString();
        order.setOrderTrackingNumber(orderId);

        List<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(orderItem -> order.addOrderItem(orderItem));

        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());

        Customer customer = purchase.getCustomer();
        Customer existingCustomer = customerRepository.findByEmail(customer.getEmail()); // email is unique in MySQL's customer table as a constraint

        if (existingCustomer != null) {
            customer = existingCustomer;
        }

        customer.addOrder(order);

        customerRepository.save(customer); // inserts a new customer if customer did not exist, or updates an existing customer with his/her additional order

        return new PurchaseConfirmation(orderId);
    }

    public PaymentIntent createPaymentIntent(Payment payment) throws StripeException {
        Map<String, Object> params = new HashMap<>();
        params.put("amount", payment.getAmount());
        params.put("currency", payment.getCurrency());
        params.put("payment_method_types", availablePaymentMethods);
        params.put("description", CREDIT_CARD_STATEMENT_DISPLAY);
        params.put("receipt_email", payment.getReceiptEmail());
        return PaymentIntent.create(params);
    }
}
