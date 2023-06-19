package sg.edu.nus.iss.server.services;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import sg.edu.nus.iss.server.models.Customer;
import sg.edu.nus.iss.server.models.Order;
import sg.edu.nus.iss.server.models.OrderItem;
import sg.edu.nus.iss.server.models.Purchase;
import sg.edu.nus.iss.server.models.PurchaseConfirmation;
import sg.edu.nus.iss.server.repositories.CustomerRepository;

@Service
public class CheckoutService {
    
    @Autowired
    private CustomerRepository customerRepository;

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
        customer.addOrder(order);

        customerRepository.save(customer);

        return new PurchaseConfirmation(orderId);
    }
}
