import React from 'react';
import { Link } from 'react-router-dom';

const Terms = () => {
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
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">Terms of Service</h1>
                    <p className="text-slate-500">Last updated: {new Date().toLocaleDateString()}</p>
                </div>

                <div className="space-y-10 text-lg leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                        <p className="text-slate-400">
                            By accessing and using FurniForge ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. We reserve the right to update these terms at any time without prior notice.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. User Accounts</h2>
                        <p className="text-slate-400">
                            You are responsible for maintaining the confidentiality of your account credentials. You must immediately notify us of any unauthorized use of your account. We will not be liable for any loss or damage arising from your failure to protect your login information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. User Genereated Content</h2>
                        <p className="text-slate-400">
                            Any 2D/3D layouts, designs, or information you create on FurniForge belong to you. However, by using the Platform, you grant us a license to store, process, and display your content in order to provide our services to you.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Acceptable Use</h2>
                        <p className="text-slate-400">
                            You agree not to use the Platform for any illegal purposes or to distribute harmful content. We reserve the right to suspend or terminate accounts that violate our usage policies.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Disclaimer of Warranties</h2>
                        <p className="text-slate-400">
                            FurniForge is provided "as is" and "as available". We do not guarantee that the service will be uninterrupted, error-free, or completely secure. Your use of the Platform is at your own risk.
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

export default Terms;
