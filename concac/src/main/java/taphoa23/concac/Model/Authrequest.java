package taphoa23.concac.Model;

public class Authrequest {

    private String username;
    private String password;
    private String Email;

    public Authrequest() {
    }

    public Authrequest(String username, String password, String Email) {
        this.username = username;
        this.password = password;
        this.Email = Email;
    }

    // Replaces @Data (Getters and Setters)
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return Email;
    }

    public void setEmail(String email) {
        Email = email;
    }
    
    // Note: @Data also generates toString(), equals(), and hashCode() behind the scenes, 
    // but for a simple Data Transfer Object (DTO) like this used just for logging in, 
    // getters and setters are all Spring Security really needs.
}