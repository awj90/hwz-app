package sg.edu.nus.iss.server.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import sg.edu.nus.iss.server.models.State;

@RepositoryRestResource
public interface StateRepository extends JpaRepository<State, Integer>{
    
    // GET /api/states/search/findByCountryCode?code=SG
    // select * from state inner join countries on state.country_id = countries.id where countries.code='SG';
    // @RequestParam String code
    List<State> findByCountryCode(@Param("code") String code);
}
