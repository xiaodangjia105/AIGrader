package com.aigrader.common;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtil {

    public record AuthUser(Long userId, String username, String role) {}

    public static AuthUser getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof AuthUser user) {
            return user;
        }
        throw new RuntimeException("User not authenticated");
    }

    public static Long getCurrentUserId() {
        return getCurrentUser().userId();
    }

    public static String getCurrentUserRole() {
        return getCurrentUser().role();
    }
}
