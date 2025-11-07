package com.project.courseweb.entities.authentication;

import com.project.courseweb.entities.Profile;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Entity
@Table(name = "auths")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Auth {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    @Column(unique = true, nullable = false)
    String email;
    String phone;
//    @Column(nullable = false)
    String passwordHash;
    @OneToOne(mappedBy = "auth", cascade = CascadeType.ALL)
    Profile profile;
    @ManyToMany(fetch = FetchType.LAZY)
            @JoinTable(
                    name = "auth_roles",
                    joinColumns = @JoinColumn(name = "auth_id"),
                    inverseJoinColumns = @JoinColumn(name = "role_id")
            )
    Set<Role> roles;
}
