async function onSignIn(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    try {
        const res = await axios.post('/api/sign-in', formData);

        if (!res?.data?.success) {
            showToast({
                text: res?.data?.message ?? 'Không thành công!',
                backgroundColor: '#ff6347',
            })
            return;
        }

        window.location.href = '/';
    }
    catch {
        showToast({
            text: res?.data?.message ?? 'Lỗi hệ thống!',
            backgroundColor: '#ff6347',
        })
    }
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('togglePassword');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

function showToast(props) {
    Toastify({
        duration: 3000,
        gravity: 'top',
        position: 'right',
        ...props,
    }).showToast()
}