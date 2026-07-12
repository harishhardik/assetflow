package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.ResourceDto;
import org.example.backend.entity.Resource;
import org.example.backend.exception.ResourceNotFoundException;
import org.example.backend.mapper.EntityMapper;
import org.example.backend.repository.ResourceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;

    @Transactional(readOnly = true)
    public List<ResourceDto> getAllResources() {
        return resourceRepository.findAll().stream()
                .map(EntityMapper::toResourceDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ResourceDto getResourceById(Long id) {
        Resource res = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with ID: " + id));
        return EntityMapper.toResourceDto(res);
    }

    @Transactional
    public ResourceDto createResource(ResourceDto dto) {
        Resource res = EntityMapper.toResource(dto);
        if (res.getStatus() == null) {
            res.setStatus("AVAILABLE");
        }
        Resource saved = resourceRepository.save(res);
        return EntityMapper.toResourceDto(saved);
    }

    @Transactional
    public ResourceDto updateResource(Long id, ResourceDto dto) {
        Resource res = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with ID: " + id));

        res.setName(dto.getName());
        res.setType(dto.getType());
        res.setCapacity(dto.getCapacity());
        res.setLocation(dto.getLocation());
        if (dto.getStatus() != null) {
            res.setStatus(dto.getStatus());
        }

        Resource saved = resourceRepository.save(res);
        return EntityMapper.toResourceDto(saved);
    }

    @Transactional
    public void deleteResource(Long id) {
        if (!resourceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Resource not found with ID: " + id);
        }
        resourceRepository.deleteById(id);
    }
}
