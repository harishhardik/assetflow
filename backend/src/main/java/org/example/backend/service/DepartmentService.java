package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.DepartmentDto;
import org.example.backend.entity.Department;
import org.example.backend.exception.ConflictException;
import org.example.backend.exception.ResourceNotFoundException;
import org.example.backend.mapper.EntityMapper;
import org.example.backend.repository.DepartmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    @Transactional(readOnly = true)
    public List<DepartmentDto> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(EntityMapper::toDepartmentDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DepartmentDto getDepartmentById(Long id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + id));
        return EntityMapper.toDepartmentDto(dept);
    }

    @Transactional
    public DepartmentDto createDepartment(DepartmentDto dto) {
        if (departmentRepository.findByName(dto.getName()).isPresent()) {
            throw new ConflictException("Department with name '" + dto.getName() + "' already exists");
        }
        Department dept = EntityMapper.toDepartment(dto);
        if (dept.getStatus() == null) {
            dept.setStatus("ACTIVE");
        }
        Department saved = departmentRepository.save(dept);
        return EntityMapper.toDepartmentDto(saved);
    }

    @Transactional
    public DepartmentDto updateDepartment(Long id, DepartmentDto dto) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + id));

        departmentRepository.findByName(dto.getName())
                .ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        throw new ConflictException("Department with name '" + dto.getName() + "' already exists");
                    }
                });

        dept.setName(dto.getName());
        dept.setDescription(dto.getDescription());
        if (dto.getStatus() != null) {
            dept.setStatus(dto.getStatus());
        }
        Department saved = departmentRepository.save(dept);
        return EntityMapper.toDepartmentDto(saved);
    }

    @Transactional
    public void deleteDepartment(Long id) {
        if (!departmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Department not found with ID: " + id);
        }
        departmentRepository.deleteById(id);
    }
}
