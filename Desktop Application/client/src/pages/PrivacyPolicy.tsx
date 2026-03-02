import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-[#06080f] text-slate-300 py-16 px-6 sm:px-12 lg:px-24">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12">
                    <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-sky-400 hover:text-sky-300 transition-colors mb-6">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">Privacy Policy</h1>
                    <p className="text-slate-500">Last updated: {new Date().toLocaleDateString()}</p>
                </div>

                <div className="space-y-10 text-lg leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
                        <p className="text-slate-400">
                            When you register for a FurniForge account, we collect your name, email address, and role preference. As you use the platform, we also store the 2D and 3D design data you create, save, and export.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
                        <p className="text-slate-400">
                            We use your information to provide, maintain, and improve our services. This includes authenticating your account, storing your design setups in the cloud, and processing PDF generation or 3D exports.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Data Security</h2>
                        <p className="text-slate-400">
                            We implement industry-standard security measures to protect your personal information and design data. Your passwords are encrypted, and we use secure connection protocols (HTTPS) to transfer data between your device and our servers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Third-Party Services</h2>
                        <p className="text-slate-400">
                            We do not sell your personal data to third parties. We may use trusted third-party services (such as cloud hosting and database providers) who assist us in operating our platform, under strict confidentiality agreements.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights</h2>
                        <p className="text-slate-400">
                            You have the right to access, correct, or delete your personal data associated with your account. If you wish to permanently delete your account and all associated designs, please contact our support team.
                        </p>
                    </section>
                </div>

                <div className="mt-16 pt-8 border-t border-white/[0.08] text-center text-sm text-slate-500">
                    © {new Date().getFullYear()} FurniForge Studio. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
