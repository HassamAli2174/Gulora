// ============================================================================
// FAQ & POLICY CONTENT
// Edit the text here to update the FAQ, Shipping & Returns and Privacy pages.
// Keep answers accurate: this is what customers (and Google) will read.
// ============================================================================

export interface FaqItem {
  question: string;
  answer: string;
}

export interface PolicySection {
  heading: string;
  paragraphs: string[];
}

export interface PolicyPage {
  title: string;
  intro: string;
  updated: string;
  sections: PolicySection[];
}

export const FAQ: FaqItem[] = [
  {
    question: 'How do I place an order?',
    answer:
      'Tap "Order on WhatsApp" on any product. A message with the product and size is prepared for you. Just send it, and we will confirm the price, delivery charges and delivery time with you directly.',
  },
  {
    question: 'How much do the products cost?',
    answer:
      'Message us on WhatsApp with the product and size you are interested in and we will share the current price along with any ongoing offers.',
  },
  {
    question: 'Do you deliver to my city?',
    answer:
      'Send us your city on WhatsApp and we will confirm delivery options, charges and the expected delivery time for your area before you confirm your order.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'Available payment options are shared with you on WhatsApp when we confirm your order.',
  },
  {
    question: 'Can I try a product before buying the full size?',
    answer:
      'Yes. Our Herbal Shampoo comes in a 20 ml tester, so you can experience it before picking up the full 500 ml bottle.',
  },
  {
    question: 'What is in the Herbal Shampoo?',
    answer:
      'It is made with more than 25 herbs, including amla, reetha and shikakai. Message us if you would like the full ingredient list.',
  },
  {
    question: 'Are your products suitable for sensitive skin?',
    answer:
      'Our products are made with herbs, but everyone\'s skin is different. We recommend a patch test on a small area 24 hours before first use, and stopping use if any irritation occurs. If you have a skin condition or allergy, please check the ingredients with us first.',
  },
  {
    question: 'How should I store my products?',
    answer:
      'Keep products closed, in a cool, dry place away from direct sunlight. Keep soap bars dry between uses so they last longer.',
  },
  {
    question: 'Do you take bulk or wholesale orders?',
    answer:
      'For bulk, gifting or wholesale enquiries, message us on WhatsApp and choose "Wholesale / bulk" on our contact form.',
  },
];

/** schema.org FAQPage, so Google can show the questions directly in search results. */
export const FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
};

export const SHIPPING_RETURNS: PolicyPage = {
  title: 'Shipping & Returns',
  intro: 'Everything you need to know about getting your Gulora order, and what to do if something is not right.',
  updated: 'October 2026',
  sections: [
    {
      heading: 'Placing and confirming your order',
      paragraphs: [
        'Orders are placed through WhatsApp. Once you message us, we confirm the products, price, delivery charges and your delivery address before dispatching anything.',
        'Your order is only final once we have confirmed these details with you.',
      ],
    },
    {
      heading: 'Delivery',
      paragraphs: [
        'Delivery charges and estimated delivery times depend on your city and are shared with you before you confirm your order.',
        'Please make sure your address and phone number are correct so our delivery partner can reach you.',
      ],
    },
    {
      heading: 'Damaged or incorrect items',
      paragraphs: [
        'If your order arrives damaged, leaking or is not what you ordered, message us on WhatsApp as soon as possible with your order details and a photo of the item and packaging. We will work with you to put it right.',
      ],
    },
    {
      heading: 'Returns and exchanges',
      paragraphs: [
        'For hygiene reasons, opened or used personal care products cannot be returned.',
        'If you have any other concern about your order, message us on WhatsApp and we will do our best to help.',
      ],
    },
  ],
};

export const PRIVACY: PolicyPage = {
  title: 'Privacy Policy',
  intro: 'We respect your privacy. This page explains what information we collect and how we use it.',
  updated: 'October 2026',
  sections: [
    {
      heading: 'Information we collect',
      paragraphs: [
        'When you order or contact us, we receive the information you choose to share, such as your name, phone number, delivery address and your messages.',
        'This website does not ask you to create an account.',
      ],
    },
    {
      heading: 'How we use it',
      paragraphs: [
        'We use your information only to respond to you, process and deliver your order, and provide customer support.',
        'We do not sell or rent your personal information to anyone. We share delivery details only with the courier handling your order.',
      ],
    },
    {
      heading: 'WhatsApp',
      paragraphs: [
        'Messages sent through WhatsApp are also handled by WhatsApp under its own privacy policy.',
      ],
    },
    {
      heading: 'Your browser',
      paragraphs: [
        'The website stores small preferences in your browser, such as light or dark mode, so they are remembered on your next visit. You can clear these at any time in your browser settings.',
      ],
    },
    {
      heading: 'Contact',
      paragraphs: [
        'If you have questions about your information or would like us to delete it, message us on WhatsApp.',
      ],
    },
  ],
};
