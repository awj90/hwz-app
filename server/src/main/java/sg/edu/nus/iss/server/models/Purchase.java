package sg.edu.nus.iss.server.models;

import java.util.LinkedList;
import java.util.List;

import lombok.Data;

@Data
public class Purchase {
    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private List<OrderItem> orderItems = new LinkedList<>();
}
