// ตรวจสอบการล็อกอิน
document.addEventListener('DOMContentLoaded', function() {
    // ตรวจสอบหน้าที่กำลังใช้งาน
    const currentPage = window.location.pathname.split('/').pop();
    
    // ระบบรักษาความปลอดภัย - ถ้าไม่ได้ล็อกอินจะถูกส่งไปหน้าล็อกอิน
    if ((currentPage === 'dashboard.html' || currentPage === 'admin-dashboard.html') && 
        sessionStorage.getItem('loggedIn') !== 'true') {
        window.location.href = 'login.html';
        return;
    }
    
    // ตั้งค่าแต่ละหน้า
    if (currentPage === 'dashboard.html') {
        loadUserData();
        setupCalendar();
        setupDashboardEvents();
    } else if (currentPage === 'login.html') {
        setupLoginPage();
    } else if (currentPage === 'register.html') {
        setupRegisterPage();
    }
});

// โหลดข้อมูลผู้ใช้จาก localStorage
function loadUserData() {
    // ข้อมูลนักเรียน
    document.getElementById('studentName').textContent = localStorage.getItem('firstName') + ' ' + localStorage.getItem('lastName') || 'นายชา คุณชาชิว';
    document.getElementById('classInfo').textContent = 'ชั้น ' + localStorage.getItem('class') || 'ม.6/1';
    document.getElementById('studentId').textContent = 'เลขประจำตัว ' + localStorage.getItem('studentId') || '61074';
    
    // โหลดรูปโปรไฟล์
    const profileImage = localStorage.getItem('profilePic');
    if (profileImage) {
        document.getElementById('profileImage').src = profileImage;
    }
    
    // ตรวจสอบการโหลดตารางเรียนจากไฟล์โดยตรง
    const timetableImg = document.getElementById('timetableImage');
    timetableImg.onerror = function() {
        // ถ้าโหลดไม่สำเร็จ ให้แสดงข้อความแจ้งเตือน
        timetableImg.style.display = 'none';
        document.getElementById('noTimetable').style.display = 'flex';
    };
    
    // ปุ่มออกจากระบบ
    document.getElementById('logoutBtn').addEventListener('click', function() {
        sessionStorage.removeItem('loggedIn');
        sessionStorage.removeItem('userRole');
        window.location.href = 'login.html';
    });
}

// ตั้งค่าปฏิทิน
function setupCalendar() {
    const calendarBody = document.getElementById('calendarBody');
    const currentDate = new Date();
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    
    // เดือนภาษาไทย
    const thaiMonths = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    
    document.getElementById('currentMonth').textContent = thaiMonths[month];
    
    // สร้างปฏิทิน
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    let date = 1;
    let calendarHTML = '';
    
    // สร้างตารางปฏิทิน
    for (let i = 0; i < 6; i++) {
        let row = '<tr>';
        
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                row += '<td></td>';
            } else if (date > daysInMonth) {
                row += '<td></td>';
            } else {
                const isToday = date === currentDate.getDate();
                row += `<td class="${isToday ? 'today' : ''}" data-date="${date}">
                    <div class="date-number">${date}</div>
                    <div class="events-container" id="events-${date}"></div>
                </td>`;
                date++;
            }
        }
        
        row += '</tr>';
        calendarHTML += row;
        
        if (date > daysInMonth) {
            break;
        }
    }
    
    calendarBody.innerHTML = calendarHTML;
    
    // เพิ่มกิจกรรมตัวอย่าง
    addSampleEvents();
    
    // ปุ่มเปลี่ยนเดือน
    document.getElementById('prevMonth').addEventListener('click', function() {
        alert('ไปยังเดือนก่อนหน้า');
    });
    
    document.getElementById('nextMonth').addEventListener('click', function() {
        alert('ไปยังเดือนถัดไป');
    });
}

// เพิ่มกิจกรรมตัวอย่าง
function addSampleEvents() {
    // กิจกรรมตัวอย่าง
    const events = [
        { date: 3, title: 'ส่งคลิปชีวะ', color: 'green' },
        { date: 3, title: 'ส่งสมุดสังคม', color: 'green' },
        { date: 4, title: 'สอบปลายภาค', color: 'yellow' },
        { date: 5, title: 'สอบปลายภาค', color: 'yellow' },
        { date: 6, title: 'สอบปลายภาค', color: 'yellow' },
        { date: 9, title: 'สอบ ALEVAL', color: 'orange' },
        { date: 10, title: 'สอบ ALEVAL', color: 'orange' },
        { date: 31, title: 'รับประกาศนียบัตร', color: 'pink' }
    ];
    
    // เพิ่มกิจกรรมเข้าไปในปฏิทิน
    events.forEach(event => {
        const eventContainer = document.getElementById(`events-${event.date}`);
        if (eventContainer) {
            const eventElement = document.createElement('div');
            eventElement.className = `event event-${event.color}`;
            eventElement.textContent = event.title;
            eventContainer.appendChild(eventElement);
        }
    });
}

// ตั้งค่าการทำงานภายในหน้า Dashboard
function setupDashboardEvents() {
    // คลิกที่ Legend เพื่อดูรายละเอียด
    document.querySelectorAll('.legend-item').forEach(item => {
        item.addEventListener('click', function() {
            alert(this.getAttribute('data-event'));
        });
    });
    
    // Theme Switcher
    const themeSwitcher = document.createElement('div');
    themeSwitcher.className = 'theme-switcher';
    themeSwitcher.innerHTML = '<i class="fas fa-moon"></i>';
    document.body.appendChild(themeSwitcher);
    
    themeSwitcher.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
    });
}

// ตั้งค่าหน้า Login
function setupLoginPage() {
    // ตรวจสอบการกดปุ่มเข้าสู่ระบบ
    document.querySelector('.submit-btn').addEventListener('click', function() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // ตรวจสอบข้อมูล
        if (!email || !password) {
            alert('กรุณากรอกอีเมลและรหัสผ่าน');
            return;
        }
        
        // ตรวจสอบการล็อกอิน (แบบง่าย)
        if (email === localStorage.getItem('email') && password === localStorage.getItem('password')) {
            sessionStorage.setItem('loggedIn', 'true');
            sessionStorage.setItem('userRole', 'student');
            window.location.href = 'dashboard.html';
        } else if (email === 'admin@school.ac.th' && password === 'admin1234') {
            sessionStorage.setItem('loggedIn', 'true');
            sessionStorage.setItem('userRole', 'admin');
            window.location.href = 'admin-dashboard.html';
        } else {
            alert('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
        }
    });
}

// ตั้งค่าหน้า Register
function setupRegisterPage() {
    // แสดงตัวอย่างรูปโปรไฟล์
    document.getElementById('profilePicInput').addEventListener('change', function(event) {
        const reader = new FileReader();
        reader.onload = function() {
            document.getElementById('previewImage').src = reader.result;
        };
        reader.readAsDataURL(event.target.files[0]);
    });
    
    // ตรวจสอบการกดปุ่มลงทะเบียน
    document.querySelector('.submit-btn').addEventListener('click', function() {
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const userClass = document.getElementById('class').value;
        const studentId = document.getElementById('studentId').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const profilePic = document.getElementById('previewImage').src;
        
        // ตรวจสอบข้อมูล
        if (!firstName || !lastName || !userClass || !studentId || !email || !password) {
            alert('กรุณากรอกข้อมูลให้ครบทุกช่อง');
            return;
        }
        
        if (password.length < 8) {
            alert('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร');
            return;
        }
        
        // บันทึกข้อมูลลง Local Storage
        localStorage.setItem('firstName', firstName);
        localStorage.setItem('lastName', lastName);
        localStorage.setItem('class', userClass);
        localStorage.setItem('studentId', studentId);
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
        localStorage.setItem('profilePic', profilePic);
        
        alert('ลงทะเบียนสำเร็จ');
        window.location.href = 'login.html';
    });
}

// ฟังก์ชั่นที่ต้องเพิ่มเข้าไปในฟังก์ชัน setupDashboardEvents()

// ตั้งค่าการทำงานภายในหน้า Dashboard
function setupDashboardEvents() {
    // คลิกที่รูปตารางเรียนเพื่อขยาย
    const timetableImg = document.getElementById('timetableImage');
    const timetableModal = document.getElementById('timetableModal');
    const closeTimetableModal = document.getElementById('closeTimetableModal');
    
    // เมื่อคลิกที่รูปตารางเรียน
    timetableImg.addEventListener('click', function() {
        // แสดง Modal
        timetableModal.style.display = 'flex';
        // ตั้งค่ารูปขยายให้เป็นรูปเดียวกับที่แสดงในหน้าหลัก
        document.getElementById('enlargedTimetable').src = timetableImg.src;
    });
    
    // เมื่อคลิกปุ่มปิด
    closeTimetableModal.addEventListener('click', function() {
        timetableModal.style.display = 'none';
    });
    
    // เมื่อคลิกนอกพื้นที่ Modal
    window.addEventListener('click', function(event) {
        if (event.target == timetableModal) {
            timetableModal.style.display = 'none';
        }
    });
    
    // คลิกที่ Legend เพื่อดูรายละเอียด
    document.querySelectorAll('.legend-item').forEach(item => {
        item.addEventListener('click', function() {
            alert(this.getAttribute('data-event'));
        });
    });
    
    // Theme Switcher
    const themeSwitcher = document.createElement('div');
    themeSwitcher.className = 'theme-switcher';
    themeSwitcher.innerHTML = '<i class="fas fa-moon"></i>';
    document.body.appendChild(themeSwitcher);
    
    themeSwitcher.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
    });
}