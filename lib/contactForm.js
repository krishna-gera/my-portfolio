import { supabase } from './supabaseClient.js';

const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = (formData.get('name') || '').toString().trim();
    const email = (formData.get('email') || '').toString().trim();
    const message = (formData.get('message') || '').toString().trim();

    if (!supabase) {
      alert('Something went wrong. Please try again.');
      return;
    }

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([{ name, email, message }]);

      if (error) throw error;

      alert('Thanks for reaching out! Krishna will get back to you soon.');
      contactForm.reset();
    } catch (error) {
      console.error('Contact form submission failed:', error);
      alert('Something went wrong. Please try again.');
    }
  });
}
