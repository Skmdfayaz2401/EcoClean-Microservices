package com.ecoclean.auth.dto;

public class LoginResponse {
    private String token;
    private String tokenType = "Bearer";
    private UserResponse user;

    public LoginResponse() {}

    public LoginResponse(String token, String tokenType, UserResponse user) {
        this.token = token;
        this.tokenType = tokenType != null ? tokenType : "Bearer";
        this.user = user;
    }

    public static LoginResponseBuilder builder() {
        return new LoginResponseBuilder();
    }

    public static class LoginResponseBuilder {
        private String token;
        private String tokenType = "Bearer";
        private UserResponse user;

        public LoginResponseBuilder token(String token) { this.token = token; return this; }
        public LoginResponseBuilder tokenType(String tokenType) { this.tokenType = tokenType; return this; }
        public LoginResponseBuilder user(UserResponse user) { this.user = user; return this; }

        public LoginResponse build() {
            return new LoginResponse(token, tokenType, user);
        }
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }
    public UserResponse getUser() { return user; }
    public void setUser(UserResponse user) { this.user = user; }
}
