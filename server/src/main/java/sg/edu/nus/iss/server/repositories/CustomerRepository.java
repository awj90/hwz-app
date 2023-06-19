package sg.edu.nus.iss.server.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import sg.edu.nus.iss.server.models.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long>{
    
}
