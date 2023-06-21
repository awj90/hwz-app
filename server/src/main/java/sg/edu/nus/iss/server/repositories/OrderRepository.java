package sg.edu.nus.iss.server.repositories;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import sg.edu.nus.iss.server.models.Order;

@RepositoryRestResource
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    // GET /api/orders/search/findByCustomerEmailOrderByDateCreatedDesc?email=fred@gmail.com&page=0&size=20
    // select * from orders join customer on orders.customer_id = customer.id where customer.email='fred@gmail.com' order by orders.date_created desc limit   20 offset 0;
    // @RequestParam String email, @RequestParam(defaultValue = 0) int page, @RequestParam(defaultValue = 20) int size
    // offset (page) and limit (size) are optional, defaults are 0 and 20 respectively
    Page<Order> findByCustomerEmailOrderByDateCreatedDesc(@Param("email") String email, Pageable pageable);
}
