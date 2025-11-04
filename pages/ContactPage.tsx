import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

const ContactPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-secondary tracking-tight">Get In Touch</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
          We'd love to hear from you! For support, feedback, or inquiries, please reach out to us.
        </p>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-secondary">Contact Information</h2>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
              <Phone size={24} />
            </div>
            <div>
              <h3 className="font-bold">Phone</h3>
              <p className="text-gray-600">For immediate assistance with your order.</p>
              <a href="tel:+2348012345678" className="text-primary font-semibold hover:underline">+234 801 234 5678</a>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
              <Mail size={24} />
            </div>
            <div>
              <h3 className="font-bold">Email</h3>
              <p className="text-gray-600">For general inquiries and feedback.</p>
              <a href="mailto:support@chopxpress.com" className="text-primary font-semibold hover:underline">support@chopxpress.com</a>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="font-bold">Our Kitchen</h3>
              <p className="text-gray-600">123 Foodie Lane, Lagos, Nigeria.</p>
              <p className="text-sm text-gray-500">(No walk-ins, delivery only)</p>
            </div>
          </div>
        </div>

        <div>
            <img src="https://i.imgur.com/U7fT0f3.png" alt="Stylized map of a city" className="rounded-lg object-cover w-full h-full min-h-[300px]" />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
