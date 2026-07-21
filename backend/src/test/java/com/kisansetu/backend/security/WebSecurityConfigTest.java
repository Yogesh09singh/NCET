package com.kisansetu.backend.security;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import static org.assertj.core.api.Assertions.assertThat;

class WebSecurityConfigTest {

    @Test
    void corsConfigurationShouldAllowFrontendOrigin() {
        UserDetailsServiceImpl userDetailsService = new UserDetailsServiceImpl() {
            @Override
            public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
                throw new UsernameNotFoundException("Not used in this test");
            }
        };

        WebSecurityConfig config = new WebSecurityConfig(userDetailsService);
        CorsConfigurationSource source = config.corsConfigurationSource();
        MockHttpServletRequest request = new MockHttpServletRequest("OPTIONS", "/api/auth/signin");
        request.addHeader("Origin", "http://localhost:5173");

        CorsConfiguration configuration = source.getCorsConfiguration(request);

        assertThat(configuration).isNotNull();
        assertThat(configuration.getAllowedOriginPatterns()).contains("*");
        assertThat(configuration.getAllowedMethods()).contains("POST");
        assertThat(configuration.getAllowedHeaders()).contains("*");
    }
}
