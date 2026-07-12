package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.AuthDto;
import org.example.backend.entity.User;
import org.example.backend.enums.RoleType;
import org.example.backend.exception.BadRequestException;
import org.example.backend.exception.ResourceNotFoundException;
import org.example.backend.mapper.EntityMapper;
import org.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public AuthDto.UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        return EntityMapper.toUserDto(user);
    }

    @Transactional(readOnly = true)
    public AuthDto.UserDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return EntityMapper.toUserDto(user);
    }

    @Transactional
    public AuthDto.UserDto promoteEmployee(Long id, String roleStr) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + id));

        RoleType roleType;
        try {
            roleType = RoleType.valueOf(roleStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid role. Role must be one of: ADMIN, ASSET_MANAGER, DEPARTMENT_HEAD, EMPLOYEE");
        }

        user.setRole(roleType);
        User saved = userRepository.save(user);
        return EntityMapper.toUserDto(saved);
    }
}
