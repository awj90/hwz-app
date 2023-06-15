package sg.edu.nus.iss.server.configs;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;
import sg.edu.nus.iss.server.models.Country;
import sg.edu.nus.iss.server.models.Product;
import sg.edu.nus.iss.server.models.ProductCategory;
import sg.edu.nus.iss.server.models.State;

@Configuration
public class DataRestConfig implements RepositoryRestConfigurer {

    @Autowired
    private EntityManager entityManager;

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {

        // Set up array of disabled HttpMethods
        HttpMethod[] disabledMethods = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE};

        // disable PUT, POST, DELETE methods for the Product class
        disableHttpMethods(config, disabledMethods, Product.class);

        // disable PUT, POST, DELETE methods for the ProductCategory class
        disableHttpMethods(config, disabledMethods, ProductCategory.class);

        // disable PUT, POST, DELETE methods for the Country class
        disableHttpMethods(config, disabledMethods, Country.class);

        // disable PUT, POST, DELETE methods for the State class
        disableHttpMethods(config, disabledMethods, State.class);

        // explicitly expose product ids and product category ids in API responses
        exposeIds(config);
    }

    private void exposeIds(RepositoryRestConfiguration config) {

        // Retrieve list of all entity classes from entity manager
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();
        
        // Initialize an empty list and build a list of entity classes
        List<Class> entityClasses = new ArrayList<>();
        for (EntityType entityType: entities) {
            entityClasses.add(entityType.getJavaType());
        }

        // convert list of entity classes to an array and expose ids for the array of entity classes
        Class[] entityClassesArr = entityClasses.toArray(new Class[entityClasses.size()]);
        config.exposeIdsFor(entityClassesArr);
    }

    private void disableHttpMethods(RepositoryRestConfiguration config, HttpMethod[] disabledMethods, Class modelClass){
         config.getExposureConfiguration()
         .forDomainType(modelClass)
         .withItemExposure((metdata, httpMethods) -> httpMethods.disable(disabledMethods))
         .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(disabledMethods));
    }
    
}
