// Main JavaScript for LonAsh Tours

document.addEventListener('DOMContentLoaded', () => {
    console.log('LonAsh Tours Website Initialized');
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Simple scroll animation for reveal
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        for (let i = 0; i < revealElements.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = revealElements[i].getBoundingClientRect().top;
            const elementVisible = 150;
            if (elementTop < windowHeight - elementVisible) {
                revealElements[i].classList.add('active');
            }
        }
    };
    window.addEventListener('scroll', revealOnScroll);
});

// Helper function to format currency
const formatGHS = (amount) => {
    return new Intl.NumberFormat('en-GH', {
        style: 'currency',
        currency: 'GHS',
    }).format(amount);
};

// Booking Form Logic (Simplified for initial version)
const handleBookingSubmission = async (data) => {
    // This will be expanded when Firebase is connected
    try {
        console.log('Sending booking data...', data);
        // Simulated API call
        return { success: true, message: 'Inquiry sent successfully!' };
    } catch (error) {
        console.error('Error submitting booking:', error);
        return { success: false, message: 'Failed to send inquiry. Please try again.' };
    }
};
