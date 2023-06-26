package sg.edu.nus.iss.server.models;

import lombok.Data;

@Data
public class Payment {
    private Integer amount; // in cents, not dollars
    private String currency;
    private String receiptEmail;
}
