package com.legalEyes.LegalEyes.security;

import com.legalEyes.LegalEyes.entities.User;
import com.legalEyes.LegalEyes.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest request) {
        OAuth2User oAuth2User = super.loadUser(request);

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String avatar = oAuth2User.getAttribute("picture");
        String providerId = oAuth2User.getAttribute("sub");

        userRepository.findByEmail(email).orElseGet(() ->
            userRepository.save(User.builder()
                .provider("google")
                .providerId(providerId)
                .email(email)
                .name(name)
                .avatarUrl(avatar)
                .role("USER")
                .build())
        );

        return oAuth2User;
    }
}