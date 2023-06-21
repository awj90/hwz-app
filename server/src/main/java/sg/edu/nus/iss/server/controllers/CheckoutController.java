package sg.edu.nus.iss.server.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
