package sg.edu.nus.iss.server.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import sg.edu.nus.iss.server.models.Country;

@CrossOrigin("http://localhost:4200")
@RepositoryRestResource(collectionResourceRel="countries", path="countries")
public interface CountryRepository extends JpaRepository<Country, Integer> {
}
