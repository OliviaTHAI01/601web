/**
 * ฟังก์ชันสำหรับ Image Lightbox
 * ให้ผู้ใช้คลิกที่รูปภาพเพื่อดูขนาดใหญ่
 */
document.addEventListener("DOMContentLoaded", function() {
    // เริ่มต้นโค้ดเมื่อหน้าเว็บโหลดเสร็จสมบูรณ์
    initImageLightbox();
});

/**
 * เริ่มต้นการทำงานของ Image Lightbox
 */
function initImageLightbox() {
    // ค้นหารูปภาพทั้งหมดในส่วน schedule-section
    const scheduleSection = document.querySelector('.schedule-section');
    if (scheduleSection) {
        const images = scheduleSection.querySelectorAll('img:not(.modal-content)');
        
        // เพิ่มคุณสมบัติ lightbox ให้กับแต่ละรูปภาพ
        images.forEach(function(img) {
            img.classList.add('schedule-image');
            img.setAttribute('title', 'คลิกเพื่อดูภาพขนาดใหญ่');
            img.addEventListener('click', function() {
                openImageModal(this);
            });
        });
    }
    
    // ตั้งค่าปุ่มปิด Modal
    setupModalCloseActions();
}

/**
 * เปิด Modal แสดงรูปภาพขนาดใหญ่
 * @param {HTMLImageElement} imgElement - รูปภาพที่ถูกคลิก
 */
function openImageModal(imgElement) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const captionText = document.getElementById("caption");
    
    modal.style.display = "block";
    
    // ใช้รูปภาพความละเอียดสูงหากมีการกำหนด data-fullsize
    modalImg.src = imgElement.getAttribute('data-fullsize') || imgElement.src;
    
    // กำหนดคำอธิบายจาก alt หรือ title
    captionText.innerHTML = imgElement.alt || imgElement.title || "";
    
    // ป้องกันการเลื่อนของ body เมื่อ modal เปิด
    document.body.style.overflow = "hidden";
}

// ฟังก์ชันแสดงบัตรนักเรียน (แบบรูปภาพ)
function showStudentCard() {
    // แสดง modal บัตรนักเรียน
    const modal = document.getElementById('studentCardModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// ฟังก์ชันซ่อนบัตรนักเรียน
function hideStudentCard() {
    const modal = document.getElementById('studentCardModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// เมื่อโหลดหน้าเว็บเสร็จ
document.addEventListener('DOMContentLoaded', function() {
    // ตั้งค่าปุ่มปิดบัตรนักเรียน
    const closeBtn = document.querySelector('.close-card');
    if (closeBtn) {
        closeBtn.addEventListener('click', hideStudentCard);
    }
    
    // ปิด modal เมื่อคลิกนอกบัตร
    const modal = document.getElementById('studentCardModal');
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                hideStudentCard();
            }
        });
    }
    
    // ปิดด้วยปุ่ม Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            hideStudentCard();
        }
    });
});

// ฟังก์ชันแสดงบัตรนักเรียนโดยครู
function showStudentCardByTeacher(studentId, classId) {
    // ค้นหาข้อมูลนักเรียนจาก ID
    const studentsList = appData.students[classId];
    if (!studentsList) return;
    
    const student = studentsList.find(s => s.id === studentId);
    if (!student) {
        alert('ไม่พบข้อมูลนักเรียน');
        return;
    }
    
    // ใส่ข้อมูลลงในบัตรนักเรียน
    document.getElementById('cardStudentName').textContent = student.name || 'ไม่ระบุ';
    document.getElementById('cardStudentClass').textContent = classId || 'ไม่ระบุ';
    document.getElementById('cardStudentId').textContent = student.studentId || 'ไม่ระบุ';
    
    // ตั้งค่า emoji โปรไฟล์
    const cardStudentEmoji = document.getElementById('cardStudentEmoji');
    if (cardStudentEmoji && student.profileEmoji) {
        cardStudentEmoji.textContent = student.profileEmoji;
    }
    
    // แสดง modal บัตรนักเรียน
    const modal = document.getElementById('studentCardModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

/**
 * ฟังก์ชันสำหรับปุ่มดาวน์โหลด (ตัวอย่าง)
 * สามารถปรับแต่งตามความต้องการ
 */
document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.querySelector('.schedule-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            // ตรวจสอบว่ามีรูปภาพที่ต้องการดาวน์โหลดหรือไม่
            const scheduleImage = document.querySelector('.schedule-image');
            if (scheduleImage) {
                // สร้าง link สำหรับดาวน์โหลด
                const link = document.createElement('a');
                link.href = scheduleImage.getAttribute('data-fullsize') || scheduleImage.src;
                link.download = 'a.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                alert('ไม่พบรูปภาพที่ต้องการดาวน์โหลด');
            }
        });
    }
});
