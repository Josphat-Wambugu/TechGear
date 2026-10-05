import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Product } from '@/types/product';

function buildFaqs(product: Product): { question: string; answer: string }[] {
  const specEntries = Object.entries(product.specs);
  const faqs: { question: string; answer: string }[] = [];

  faqs.push({
    question: `What's included when I order the ${product.name}?`,
    answer: `Your order includes the ${product.name} itself along with all standard accessories and documentation from ${product.brand}. Anything sold separately is called out in the product title.`,
  });

  if (specEntries.length > 0) {
    const [specName, specValue] = specEntries[0];
    faqs.push({
      question: `What's the ${specName.toLowerCase()} on this?`,
      answer: `${specValue}. You can find the full spec breakdown in the Specifications table above.`,
    });
  }

  faqs.push({
    question: 'How long does shipping take, and is it free?',
    answer:
      'Orders over $75 ship free. Most orders arrive within 3-5 business days after dispatch; you’ll get a tracking link by email as soon as your order ships.',
  });

  faqs.push({
    question: 'What if I need to return or exchange it?',
    answer:
      'This product is covered by our standard 30-day return policy — no questions asked, as long as it’s in its original condition and packaging. Exchanges follow the same window.',
  });

  faqs.push({
    question: 'Does it come with a warranty?',
    answer: `Yes — every ${product.category.toLowerCase()} item we sell, including this one, is covered by a 2-year warranty against manufacturing defects.`,
  });

  if (product.tags.includes('wireless') || product.tags.includes('bluetooth')) {
    faqs.push({
      question: 'Does it work with both Android and iOS?',
      answer: 'Yes, it connects over standard Bluetooth and is compatible with both Android and iOS devices, as well as most Bluetooth-enabled laptops and desktops.',
    });
  }

  return faqs;
}

export default function ProductFaq({ product }: { product: Product }) {
  const faqs = buildFaqs(product);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 shadow-sm">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={faq.question}>
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
                aria-expanded={isOpen}
              >
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{faq.question}</span>
                <ChevronDown
                  size={16}
                  className={`flex-shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-4 -mt-1">
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
