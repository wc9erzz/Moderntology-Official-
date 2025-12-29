// app/legal/terms/page.tsx
import { Metadata } from 'next';
import Footer from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms and conditions governing your use of our service.'
};

export default function TermsOfServicePage() {
  return (
    <div className="bg-black min-h-screen overflow-x-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-red-500/10"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-xl text-zinc-300">Last Updated: October 11, 2025</p>
        </div>

        <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-700 rounded-2xl p-8 text-zinc-300 leading-relaxed space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
            <p>
              Welcome to our Property Data Platform. These Terms of Service (&quot;Terms&quot;) govern your access to and use of our website, applications, and services (collectively, the &quot;Service&quot;). By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the Terms, you may not access the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Accounts and Subscriptions</h2>
            <h3 className="text-xl font-semibold text-white mt-6 mb-3">2.1 Account Registration</h3>
            <p className="mb-4">
              To access certain features of the Service, you must create an account. You must provide accurate and complete information when creating your account. You are responsible for maintaining the security of your account and password. You agree to notify us immediately of any unauthorized access to or use of your account.
            </p>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">2.2 Subscription Plans</h3>
            <p className="mb-4">
              Access to certain features of our Service requires a paid subscription. By subscribing to our Service, you agree to pay all fees associated with your subscription plan. Subscription fees are billed in advance and are non-refundable except as specified in our Refund Policy. We reserve the right to change subscription fees upon reasonable notice.
            </p>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">2.3 Free Trials</h3>
            <p className="mb-4">
              We may offer free trial periods for our subscription plans. At the end of the trial period, your subscription will automatically convert to a paid subscription unless you cancel prior to the end of the trial period.
            </p>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">2.4 Cancellation</h3>
            <p className="mb-4">
              You may cancel your subscription at any time through your account settings or by contacting us. Upon cancellation, your subscription and access to the Service will be terminated immediately. You will not be charged for subsequent billing periods, but you will not receive a refund for any unused portion of your current billing period except as outlined in our Refund Policy.
            </p>

            {/* New Refund Policy Section */}
            <h3 className="text-xl font-semibold text-white mt-6 mb-3">2.5 Refund Policy</h3>
            <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-4 mb-4">
              <p className="font-bold text-white">
                Refunds are only available within 24 hours of your initial purchase.
              </p>
            </div>
            <p className="mb-4">
              To request a refund, contact our support team at <a href="mailto:TheListBeforeTheList@gmail.com" className="text-pink-400 hover:underline">TheListBeforeTheList@gmail.com</a> within this 24-hour period. Refund requests submitted after 24 hours from purchase will not be honored.
            </p>
            <p className="mb-4">
              Please note that this refund window applies to each subscription purchase or renewal separately. Once the 24-hour period has elapsed, subscription fees are non-refundable. Upon cancellation after the 24-hour refund window, your access will be terminated immediately with no refund for the unused portion of your billing period.
            </p>
            <p className="mb-4">
              Refunds will be processed using the same payment method used for the original purchase. Processing times for refunds depend on your payment provider and may take 5-10 business days to appear on your statement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Use of the Service</h2>
            <h3 className="text-xl font-semibold text-white mt-6 mb-3">3.1 Permitted Use</h3>
            <p className="mb-4">
              You may use our Service only for lawful purposes and in accordance with these Terms. You agree not to use our Service:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>In any way that violates any applicable federal, state, local, or international law or regulation.</li>
              <li>To engage in any activity that interferes with or disrupts the Service or servers or networks connected to the Service.</li>
              <li>To attempt to gain unauthorized access to any portion of the Service, other accounts, computer systems, or networks connected to the Service.</li>
              <li>To scrape, crawl, or use automated methods to access or collect data from our Service.</li>
              <li>To redistribute, sell, or provide access to the data obtained through our Service without our explicit written permission.</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">3.2 User Content</h3>
            <p className="mb-4">
              Our Service may allow you to post, store, or share content. You retain ownership of any content you submit, but you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute such content in connection with the Service.
            </p>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">3.3 Usage Limits</h3>
            <p className="mb-4">
              We may impose usage limits on certain features of our Service, including the number of property searches, data exports, or copies of parcel IDs. These limits may vary based on your subscription plan. Exceeding these limits may result in temporary restrictions or additional charges.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Intellectual Property</h2>
            <p className="mb-4">
              The Service and its original content, features, and functionality are and will remain the exclusive property of IDigData LLC and its licensors. The Service is protected by copyright, trademark, and other laws of the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
            </p>
            <p className="mb-4">
              The data provided through our Service is compiled from various public and private sources. While we strive for accuracy, we make no guarantees regarding the completeness, accuracy, or reliability of this data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Disclaimer of Warranties</h2>
            <p className="mb-4">
              YOUR USE OF THE SERVICE IS AT YOUR SOLE RISK. THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS. WE EXPRESSLY DISCLAIM ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
            <p className="mb-4">
              WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE, OR THAT ANY ERRORS IN THE SERVICE WILL BE CORRECTED.
            </p>
            <p className="mb-4">
              THE INFORMATION PROVIDED THROUGH OUR SERVICE IS FOR INFORMATIONAL PURPOSES ONLY AND SHOULD NOT BE RELIED UPON FOR LEGAL, FINANCIAL, TAX, OR OTHER PROFESSIONAL ADVICE.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Limitation of Liability</h2>
            <p className="mb-4">
              IN NO EVENT SHALL IDIGDATA LLC, OUR DIRECTORS, OFFICERS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Indemnification</h2>
            <p className="mb-4">
              You agree to defend, indemnify, and hold harmless IDigData LLC, its officers, directors, employees, and agents, from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys&apos; fees) arising out of or relating to your violation of these Terms or your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Termination</h2>
            <p className="mb-4">
              We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms.
            </p>
            <p className="mb-4">
              Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service or contact us to request account deletion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the updated Terms on this page with a new &quot;Last Updated&quot; date.
            </p>
            <p className="mb-4">
              Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Governing Law</h2>
            <p className="mb-4">
              These Terms shall be governed and construed in accordance with the laws of the State of Missouri, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about these Terms, please contact us at:
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
