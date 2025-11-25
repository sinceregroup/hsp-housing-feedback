// 1. Parse URL Parameters (Global Scope)
const urlParams = new URLSearchParams(window.location.search);

document.addEventListener('DOMContentLoaded', function () {
    const buildingParam = urlParams.get('building') || '未指定';

    // 2. Set Building Field
    const buildingInput = document.getElementById('building');
    buildingInput.value = buildingParam;

    // 3. Populate Floor Dropdown
    const floorSelect = document.getElementById('floor');
    const floors = buildingFloors[buildingParam] || []; // Default to empty if building not found

    if (floors.length > 0) {
        floors.forEach(floor => {
            const option = document.createElement('option');
            option.value = floor;
            option.textContent = floor;
            floorSelect.appendChild(option);
        });
    } else {
        // Fallback if building is unknown or has no config
        const option = document.createElement('option');
        option.value = "其他";
        option.textContent = "其他 (Other)";
        floorSelect.appendChild(option);
    }
});

// Image Preview and Base64 Conversion
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');
const imageBase64 = document.getElementById('imageBase64');
const imageStatus = document.createElement('div');
imageStatus.className = 'mt-2 small text-muted';
imageInput.parentNode.appendChild(imageStatus);

imageInput.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        imageStatus.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>處理圖片中... (Processing...)';
        const reader = new FileReader();
        reader.onload = function (e) {
            // Show preview
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';

            // Set Base64 string to hidden input (remove data:image/xxx;base64, prefix)
            const base64String = e.target.result.split(',')[1];
            imageBase64.value = base64String;
            imageStatus.innerHTML = '<span class="text-success fw-bold">✓ 圖片已準備就緒 (Image Ready)</span>';
        };
        reader.readAsDataURL(file);
    } else {
        imagePreview.style.display = 'none';
        imagePreview.src = '';
        imageBase64.value = '';
        imageStatus.innerHTML = '';
    }
});

// Handle Close Window
function handleClose() {
    window.close();
    // Fallback if window.close() is blocked
    setTimeout(() => {
        alert("因瀏覽器安全性限制，請手動關閉此分頁。\nDue to browser security, please close this tab manually.");
    }, 100);
}

// Form Submission
$('#submitBtn').on('click', function () {
    const submitButton = $(this);
    const form = document.getElementById('feedbackForm');

    // Validation
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Phone Validation (Optional but strict if entered)
    const contactInput = $('#contact').val();
    if (contactInput) {
        // Allow: 09xxxxxxxx (Mobile), 0x-xxxxxxx (Landline), or with extension #xxxx
        // Simple regex: Starts with 0, contains digits, dashes, or #, min length 7
        const phoneRegex = /^0[\d\-#]{6,20}$/;
        if (!phoneRegex.test(contactInput)) {
            $('#alertModalBody').html('請輸入有效的聯絡電話或分機。<br>Please enter a valid phone number or extension.');
            const alertModal = new bootstrap.Modal(document.getElementById('alertModal'));
            alertModal.show();
            return;
        });
    }
});
