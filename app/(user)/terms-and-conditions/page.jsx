// TermsAndConditions.jsx
import Footer from '@/app/components/footer';
import React from 'react';

const TermsAndConditions = () => {
    return (
        <>
         <div className="bg-gray-900 text-white p-8">
            <h1 className="text-3xl mb-6">Terms and Conditions</h1>

            <div className="mb-8">
                <h2 className="text-xl mb-2">1. Acceptance of Terms</h2>
                <p>By accessing and using hiregurkha.com (referred to as "the Site"), you agree to comply with and be bound by the following terms and conditions. If you do not agree with any of these terms, you are prohibited from using or accessing this Site. These terms may be updated or modified from time to time without prior notice.</p>
            </div>

            <div className="mb-8">
                <h2 className="text-xl mb-2">2. Description of Service</h2>
                <p>hiregurkha.com provides a platform for buying and selling architect products online. The Site facilitates transactions between buyers and sellers of architect-related products and services. hiregurkha.com does not directly sell any products and is not responsible for the quality, accuracy, or legality of the products listed on the Site.</p>
            </div>

            <div className="mb-8">
                <h2 className="text-xl mb-2">3. User Accounts</h2>
                <p>Users may be required to create an account to access certain features of the Site. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to provide accurate and complete information when creating your account and to update your information as necessary to keep it accurate and current.</p>
            </div>

            <div className="mb-8">
                <h2 className="text-xl mb-2">4. Buying and Selling</h2>
                <p>a. Buyers: By placing an order on hiregurkha.com, you agree to pay the specified price for the products purchased, including any applicable taxes and shipping fees. All sales are final unless otherwise specified by the seller.
b. Sellers: By listing products for sale on hiregurkha.com, you agree to accurately describe your products and to fulfill orders promptly and satisfactorily. Sellers are responsible for setting their own prices and managing their inventory.</p>
            </div>

            <div className="mb-8">
                <h2 className="text-xl mb-2">5. Intellectual Property</h2>
                <p>All content and materials on hiregurkha.com, including but not limited to text, images, logos, and trademarks, are the property of hiregurkha.com or its licensors and are protected by copyright, trademark, and other intellectual property laws. You may not use, reproduce, or distribute any content from the Site without prior written permission from hiregurkha.com.</p>
            </div>

            <div className="mb-8">
                <h2 className="text-xl mb-2">6. Prohibited Activities</h2>
                <p>You agree not to:
a. Use the Site for any unlawful purpose or to engage in any illegal activities.
b. Upload, post, or transmit any content that is infringing, libelous, defamatory, obscene, or otherwise objectionable.
c. Interfere with or disrupt the operation of the Site or the servers or networks connected to the Site.
d. Attempt to gain unauthorized access to any part of the Site or to other users' accounts.
e. Use any automated means, such as robots or scripts, to access the Site or collect information from the Site.</p>
            </div>

            <div className="mb-8">
                <h2 className="text-xl mb-2">7. Limitation of Liability</h2>
                <p>hiregurkha.com is not liable for any direct, indirect, incidental, special, or consequential damages arising out of or in any way connected with your use of the Site or the products purchased through the Site. This includes, but is not limited to, damages for loss of profits, goodwill, use, data, or other intangible losses.</p>
            </div>

            <div className="mb-8">
                <h2 className="text-xl mb-2">8. Governing Law</h2>
                <p>These terms and conditions shall be governed by and construed in accordance with the laws of Nepal, without regard to its conflict of law provisions.</p>
            </div>
           
            
            <div className="mb-8">
                <h2 className="text-xl mb-2">9. Contact Information</h2>
                <p>If you have any questions or concerns about these terms and conditions, please contact us at <a href="mailto:info@hiregurkha.com" className="text-yellow-400">info@hiregurkha.com</a>.</p>
            </div>
        </div>

        <Footer />
        </>
       

    );
};

export default TermsAndConditions;
