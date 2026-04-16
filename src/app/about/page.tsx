import React from 'react';
import { Navbar, Footer } from '@/components/layout';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden">
        <section className="pt-32 pb-24 bg-white">
          <div className="max-w-3xl mx-auto px-7">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-oranged mb-3">
              <span className="w-4 h-0.5 bg-orange rounded"></span>About us
            </div>
            <h1 className="font-display text-4xl font-bold text-ink mb-8 tracking-tight">
              About{' '}
              <em className="font-normal" style={{ fontStyle: 'italic', color: '#FF6B35' }}>
                us
              </em>
            </h1>

            <div className="space-y-6 text-base text-inkm leading-relaxed">
              <p>
                Cristel Esteban is an experienced early childhood educator who has worked as a kindergarten teacher in a couple of international schools in France. During this time, she witnessed first-hand the importance of supporting children&apos;s social and emotional development from an early age.
              </p>
              <p>
                Drawing on her classroom experience and research into Social and Emotional Learning, Cristel developed these storybook lessons and a structured wellbeing program to make SEL accessible, engaging, and fun for young learners.
              </p>
              <p>
                Her approach combines play, stories, art, and music to help children develop emotional awareness, confidence, empathy, and positive relationships.
              </p>
              <p>
                Cristel is passionate about supporting children to reach their full emotional and social potential, and helping teachers bring SEL into the classroom in a practical and enjoyable way.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
