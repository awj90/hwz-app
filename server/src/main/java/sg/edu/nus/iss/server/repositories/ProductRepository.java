package sg.edu.nus.iss.server.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import sg.edu.nus.iss.server.models.Product;

@RepositoryRestResource
public interface ProductRepository extends JpaRepository<Product, Long>{
    
    // GET /api/products/search/findByCategoryId?id=1&page=0&size=20
    // select * from product where category_id = 1 offset 0 limit 20;
    // @RequestParam Long id, @RequestParam(defaultValue = 0) int page, @RequestParam(defaultValue = 20) int size
    // offset (page) and limit (size) are optional, defaults are 0 and 20 respectively
    Page<Product> findByCategoryId(@Param("id") Long id, Pageable pageable);

    // GET /api/products/search/findByNameContainingOrDescriptionContaining?name=fred&description=fred&page=0&size=20
    // select * from product where name like '%fred%' or description like '%fred%' offset 0 limit 20;
    // @RequestParam String name, @RequestParam String description, @RequestParam(defaultValue = 0) int page, @RequestParam(defaultValue = 20) int size
    // offset (page) and limit (size) are optional, defaults are 0 and 20 respectively
    Page<Product> findByNameContainingOrDescriptionContaining(@Param("name") String name, @Param("description") String description, Pageable pageable);

    // GET /api/products/1
    // select * from product where id = 1
    // @PathVariable Long id
}
