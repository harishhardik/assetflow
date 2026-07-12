package org.example.backend.config;

import lombok.RequiredArgsConstructor;
import org.example.backend.entity.Category;
import org.example.backend.entity.Department;
import org.example.backend.entity.Resource;
import org.example.backend.entity.User;
import org.example.backend.entity.Asset;
import org.example.backend.enums.AssetCondition;
import org.example.backend.enums.AssetStatus;
import org.example.backend.enums.RoleType;
import org.example.backend.repository.CategoryRepository;
import org.example.backend.repository.DepartmentRepository;
import org.example.backend.repository.ResourceRepository;
import org.example.backend.repository.UserRepository;
import org.example.backend.repository.AssetRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final DepartmentRepository departmentRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final AssetRepository assetRepository;
    private final ResourceRepository resourceRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (departmentRepository.count() > 0) {
            System.out.println("Database already seeded. Skipping seeder.");
            return;
        }

        System.out.println("Seeding default database data...");

        // 1. Departments
        Department engineering = Department.builder().name("Engineering").description("Software engineering team").status("Active").build();
        Department sales = Department.builder().name("Sales").description("Global sales operations").status("Active").build();
        Department marketing = Department.builder().name("Marketing").description("Digital marketing team").status("Active").build();
        Department product = Department.builder().name("Product Design").description("Product design operations").status("Active").build();
        Department maintenance = Department.builder().name("Maintenance").description("IT and office facilities maintenance").status("Active").build();

        departmentRepository.saveAll(List.of(engineering, sales, marketing, product, maintenance));

        // 2. Categories
        Category laptops = Category.builder().name("Laptops").description("Employee notebooks and portables").build();
        Category monitors = Category.builder().name("Monitors").description("High resolution office displays").build();
        Category furniture = Category.builder().name("Furniture").description("Desks, chairs and physical fittings").build();
        Category servers = Category.builder().name("Servers").description("Compute nodes and server clusters").build();

        categoryRepository.saveAll(List.of(laptops, monitors, furniture, servers));

        // 3. Users
        User admin = User.builder()
                .fullName("System Administrator")
                .email("admin@assetflow.com")
                .password(passwordEncoder.encode("Admin@123"))
                .phone("+15550100")
                .department(engineering)
                .role(RoleType.ADMIN)
                .active(true)
                .build();

        User manager = User.builder()
                .fullName("Alex Carter")
                .email("manager@assetflow.com")
                .password(passwordEncoder.encode("Manager@123"))
                .phone("+15550101")
                .department(engineering)
                .role(RoleType.ASSET_MANAGER)
                .active(true)
                .build();

        User head = User.builder()
                .fullName("Sarah Jenkins")
                .email("head@assetflow.com")
                .password(passwordEncoder.encode("Head@123"))
                .phone("+15550102")
                .department(engineering)
                .role(RoleType.DEPARTMENT_HEAD)
                .active(true)
                .build();

        User employee = User.builder()
                .fullName("Priya Patel")
                .email("employee@assetflow.com")
                .password(passwordEncoder.encode("Employee@123"))
                .phone("+15550103")
                .department(engineering)
                .role(RoleType.EMPLOYEE)
                .active(true)
                .build();

        userRepository.saveAll(List.of(admin, manager, head, employee));

        // 4. Resources (Conference rooms, shared devices)
        Resource roomA = Resource.builder().name("Conference Room A").type("Venues").capacity(12).location("HQ - Floor 4").status("Available").build();
        Resource roomB = Resource.builder().name("Conference Room B").type("Venues").capacity(8).location("HQ - Floor 3").status("Available").build();
        Resource spectrometer = Resource.builder().name("Spectrometer Pro").type("Equipment").capacity(1).location("Lab Unit 2").status("Available").build();
        Resource workstation = Resource.builder().name("Workstation 08").type("Equipment").capacity(1).location("Creative Suite").status("Available").build();

        resourceRepository.saveAll(List.of(roomA, roomB, spectrometer, workstation));

        // 5. Default Assets
        Asset laptop1 = Asset.builder()
                .assetTag("AF-0114")
                .assetName("MacBook Pro 16\" M3")
                .serialNumber("SN-MBP-9921")
                .description("Developer laptop")
                .purchaseDate(LocalDate.now().minusMonths(6))
                .purchasePrice(new BigDecimal("2499.00"))
                .vendor("Apple Enterprise")
                .location("San Francisco")
                .status(AssetStatus.AVAILABLE)
                .condition(AssetCondition.GOOD)
                .department(engineering)
                .category(laptops)
                .build();

        Asset monitor1 = Asset.builder()
                .assetTag("AF-0812")
                .assetName("UltraSharp 49\" Monitor")
                .serialNumber("SN-DELL-8812")
                .description("Ultrawide productivity monitor")
                .purchaseDate(LocalDate.now().minusMonths(12))
                .purchasePrice(new BigDecimal("1199.00"))
                .vendor("Dell Direct")
                .location("London Hub")
                .status(AssetStatus.AVAILABLE)
                .condition(AssetCondition.GOOD)
                .department(sales)
                .category(monitors)
                .build();

        assetRepository.saveAll(List.of(laptop1, monitor1));

        System.out.println("Seeding database completed successfully!");
    }
}
