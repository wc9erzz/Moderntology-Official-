// app/legal/privacy/page.tsx
import { Metadata } from 'next';
import Footer from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Our commitment to protecting your privacy and data.'
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-black min-h-screen overflow-x-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-red-500/10"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-xl text-zinc-300">Last Updated: October 11, 2025</p>
        </div>

        <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-700 rounded-2xl p-8 text-zinc-300 leading-relaxed space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
            <p>
              Welcome to our Property Data Platform. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
            <p className="mb-3">
              We collect several different types of information for various purposes to provide and improve our service to you:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Personal Information:</strong> Email address, name, and payment information when you sign up.</li>
              <li><strong>Usage Data:</strong> Information on how you access and use our services, including property searches and copy actions.</li>
              <li><strong>Authentication Data:</strong> We store authentication data required to maintain your session.</li>
              <li><strong>Subscription Data:</strong> Information about your subscription plan and status.</li>
              <li><strong>User Preferences:</strong> Information about your display preferences and settings.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h2>
            <p className="mb-3">We use the collected data for various purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and maintain our service</li>
              <li>To process your payments</li>
              <li>To notify you about changes to our service</li>
              <li>To provide customer support</li>
              <li>To gather analytics data to improve our service</li>
              <li>To prevent fraudulent activities</li>
              <li>To personalize your experience</li>
              <li>To send you marketing communications (you may opt out by emailing us)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Data Storage and Security</h2>
            <p>
              Your data is stored in Supabase, a secure database platform. We implement appropriate security measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. Payment information is processed by Stripe, our payment processor, which maintains high-security standards for handling payment data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Data Retention</h2>
            <p>
              We retain your personal data for as long as your account remains active. If you delete your account, all associated personal data will be permanently deleted from our systems. We do not retain user data after account deletion, except where required by law for record-keeping purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Third-Party Services</h2>
            <p className="mb-3">
              Our service integrates with the following third-party services:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Stripe:</strong> For processing payments</li>
              <li><strong>Google OAuth:</strong> For authentication</li>
            </ul>
            <p className="mt-3">
              These third parties have their own privacy policies addressing how they use such information. We do not sell your personal data to any third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Marketing Communications</h2>
            <p>
              We may send you marketing emails about our services, new features, and special offers. You can opt out of receiving marketing communications at any time by emailing us at <a href="mailto:TheListBeforeTheList@gmail.com" className="text-pink-400 hover:underline">TheListBeforeTheList@gmail.com</a> with your request to unsubscribe.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">International Users</h2>
            <p>
              Our services are primarily operated in the United States. If you are accessing our service from outside the United States, please be aware that your information may be transferred to, stored, and processed in the United States where our servers are located. By using our service, you consent to the transfer of your information to the United States.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Children&apos;s Privacy</h2>
            <p>
              Our service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately, and we will take steps to remove such information from our systems.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Your Rights</h2>
            <p className="mb-3">
              Under data protection laws, you have rights including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The right to access your personal data</li>
              <li>The right to correction of your personal data</li>
              <li>The right to erasure of your personal data</li>
              <li>The right to restrict processing of your personal data</li>
              <li>The right to data portability</li>
              <li>The right to object to processing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Cookies</h2>
            <p>
              We use cookies to maintain session information and provide a personalized experience. These cookies are essential for the functioning of our service. By using our service, you consent to our use of cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date at the top of this policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mb-2">
              <strong>IDigData LLC</strong>
            </p>
            <p>
              Email: <a href="mailto:TheListBeforeTheList@gmail.com" className="text-pink-400 hover:underline">TheListBeforeTheList@gmail.com</a>
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
