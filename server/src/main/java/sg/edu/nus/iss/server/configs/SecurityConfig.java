package sg.edu.nus.iss.server.configs;

import com.okta.spring.boot.oauth.Okta;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.accept.ContentNegotiationStrategy;
import org.springframework.web.accept.HeaderContentNegotiationStrategy;
 
@Configuration
public class SecurityConfig {
   
   @Bean
   protected SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
       http.authorizeHttpRequests(requests ->
               requests
                       .requestMatchers("/api/orders/**")
                       .authenticated()
                       .anyRequest().permitAll())
               .oauth2ResourceServer(server -> server
                       .jwt()); // configure oauth2 resource server support and enable jwt-encoded bearer token support
 
      // add support for CORS filters
      http.cors();
      
      // add content negotiation strategy to directly display response header to unauthorized users
      http.setSharedObject(ContentNegotiationStrategy.class, new
            HeaderContentNegotiationStrategy());
      Okta.configureResourceServer401ResponseBody(http);
      
      // disable cross site request forgery
      http.csrf().disable();
      
      return http.build();
   }
 
}
