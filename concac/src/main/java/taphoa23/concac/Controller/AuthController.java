package taphoa23.concac.Controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import taphoa23.concac.Model.Authrequest;
import taphoa23.concac.Model.User;
import taphoa23.concac.Repository.UserRepository;
import taphoa23.concac.Services.JwtService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AuthController {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Authrequest request) {
        String username = request.getUsername();
        String password = request.getPassword();

        // 1. Kiểm tra tài khoản demo nếu chưa tạo DB
        if (("admin".equals(username) && "admin".equals(password)) || 
            ("4siankollective".equals(username) && "admin".equals(password))) {
            String token = jwtService.generateToken(username);
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("username", username);
            response.put("role", "admin");
            return ResponseEntity.ok(response);
        }

        if ("khachhangvip".equals(username) && "123".equals(password)) {
            String token = jwtService.generateToken(username);
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("username", username);
            response.put("role", "customer");
            return ResponseEntity.ok(response);
        }

        // 2. Kiểm tra trong database
        try {
            var userOpt = userRepository.findByUsername(username)
                    .or(() -> userRepository.findByEmail(username));
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                boolean matches = passwordEncoder.matches(password, user.getPassword()) || password.equals(user.getPassword());
                if (matches) {
                    String token = jwtService.generateToken(user.getUsername());
                    Map<String, Object> response = new HashMap<>();
                    response.put("token", token);
                    response.put("username", user.getUsername());
                    response.put("email", user.getEmail());
                    response.put("role", (user.getRoles() != null && user.getRoles().contains("ADMIN")) ? "admin" : "customer");
                    return ResponseEntity.ok(response);
                }
            }
        } catch (Exception ignored) {
        }

        return ResponseEntity.status(401).body(Map.of("message", "Sai tài khoản hoặc mật khẩu!"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        String email = body.get("email");

        if (username == null || password == null || email == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Vui lòng nhập đầy đủ thông tin!"));
        }

        try {
            if (userRepository.existsByUsername(username)) {
                return ResponseEntity.badRequest().body(Map.of("message", "Tên đăng nhập đã tồn tại!"));
            }
            if (userRepository.existsByEmail(email)) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email đã tồn tại!"));
            }

            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setRoles(Set.of("CUSTOMER"));
            userRepository.save(user);
        } catch (Exception ignored) {
        }

        String token = jwtService.generateToken(username);
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("username", username);
        response.put("email", email);
        response.put("role", "customer");
        return ResponseEntity.ok(response);
    }
}