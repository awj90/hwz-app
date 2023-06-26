package sg.edu.nus.iss.server.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

import sg.edu.nus.iss.server.models.Payment;
import sg.edu.nus.iss.server.models.Purchase;
import sg.edu.nus.iss.server.models.PurchaseConfirmation;
import sg.edu.nus.iss.server.services.CheckoutService;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {
    
    @Autowired
    private CheckoutService checkoutService;

    // POST /api/checkout/purchase 
    @PostMapping("/purchase")
    public PurchaseConfirmation placeOrder(@RequestBody Purchase purchase) {
        return checkoutService.placeOrder(purchase);
    }

    @PostMapping(path="/payment-intent", produces=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> createPaymentIntent(@RequestBody Payment payment) throws StripeException {
        PaymentIntent paymentIntent = checkoutService.createPaymentIntent(payment);

        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(paymentIntent.toJson());
    }
}
