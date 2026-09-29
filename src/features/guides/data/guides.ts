/**
 * Public laundry guides. Each guide is a real, standalone answer to a common
 * laundry question in Ghana. Keep claims factual: no invented prices,
 * statistics, rankings or partner coverage. Update `dateModified` on any
 * substantive edit so the sitemap and Article schema stay honest.
 */

export interface GuideSection {
  heading: string
  paragraphs?: string[]
  bullets?: string[]
  steps?: string[]
}

export interface GuideFaq {
  question: string
  answer: string
}

export interface Guide {
  slug: string
  title: string
  metaTitle: string
  description: string
  summary: string
  datePublished: string
  dateModified: string
  readingMinutes: number
  sections: GuideSection[]
  faqs: GuideFaq[]
}

export const GUIDES: Guide[] = [
  {
    slug: 'how-to-choose-a-laundry-service-in-ghana',
    title: 'How to choose a laundry service in Ghana: a practical checklist',
    metaTitle: 'How to Choose a Laundry Service in Ghana (Checklist)',
    description:
      'What to check before you trust a laundry with your clothes in Ghana: services, per-kilo vs per-item pricing, turnaround, item tracking, damage policy, Mobile Money payment and pickup.',
    summary:
      'Pricing models, turnaround, item counts, damage policies and the questions to ask before you hand over your clothes.',
    datePublished: '2026-09-29',
    dateModified: '2026-09-29',
    readingMinutes: 6,
    sections: [
      {
        heading: 'Know what you need before you compare',
        paragraphs: [
          'Most laundry services in Ghana offer some mix of wash and fold, ironing, dry cleaning, and pickup and delivery. Before you compare prices, write down what you actually send out in a normal week or month. A student with a bag of T-shirts and bedsheets needs something very different from someone with five work shirts and a suit, or a family sending duvets and curtains before Christmas.',
        ],
        bullets: [
          'Everyday clothes such as T-shirts, jeans, towels and bedsheets: look for wash and fold.',
          'Work shirts, trousers and uniforms: look for washing plus ironing or steam pressing.',
          'Suits, blazers, silk, lace, beaded outfits and kente: look for a laundry that offers dry cleaning or specialist hand care.',
          'Duvets, curtains and rugs: ask whether the laundry has large-capacity machines and how long bulky items take to dry.',
        ],
      },
      {
        heading: 'Understand how they price: per kilo, per item or per bag',
        paragraphs: [
          'Laundries usually price in one of three ways. Per-kilo pricing charges by weight and suits bulky everyday items. Per-item pricing charges a fixed amount for each shirt, dress or suit and suits formal wear. Per-bag pricing charges a flat amount for a bag of a set size. Many laundries mix them, for example charging by weight for wash and fold and per item for dry cleaning.',
          'Ask for the price list in writing, then check the three things that most often change the final bill: whether ironing is included or charged separately, whether pickup and delivery cost extra, and whether express service carries a surcharge.',
        ],
      },
      {
        heading: 'Ask about turnaround, and what "express" really means',
        paragraphs: [
          'Ask how many days a normal order takes and whether that changes for dry cleaning, bulky items or public holidays. If you need clothes back quickly, ask what the express option costs and by what time an order must be collected to qualify. In the rainy season, clothes that are air dried can take longer, so it is worth asking whether the laundry uses dryers.',
        ],
      },
      {
        heading: 'Check how they keep track of your clothes',
        paragraphs: [
          'Lost and mixed-up items cause more complaints than anything else. A good laundry counts your items when it collects them and gives you a record of that count, either a written receipt or a digital order. Some also tag each garment.',
          'Before you hand over anything valuable, take a quick photo and note any stains or damage that are already there. Make sure the laundry records them too, so there is no argument later about when the damage happened.',
        ],
      },
      {
        heading: 'Read the damage and lost-item policy',
        paragraphs: [
          'Ask what happens if an item is damaged, shrinks, loses colour or goes missing, and how long you have to report a problem after delivery. It is much easier to get a clear answer before anything goes wrong. Be careful with any laundry that will not answer this question.',
        ],
      },
      {
        heading: 'Confirm payment options and receipts',
        paragraphs: [
          'Many laundries in Ghana accept Mobile Money, and some accept cards or cash. Whichever you use, make sure you get a receipt or an order record showing exactly what you paid for.',
        ],
      },
      {
        heading: 'Look for clear communication',
        paragraphs: [
          'You should know when your clothes will be collected, when they are ready and when they will be delivered. Laundries that send updates by SMS, WhatsApp or an app save you from calling to chase your order.',
        ],
      },
      {
        heading: 'Start with a small first order',
        paragraphs: [
          'Send a few everyday items first. Check the count, how clean everything is, the folding or pressing, and whether delivery arrived when promised. Only then trust the laundry with a suit or a special outfit.',
        ],
      },
      {
        heading: 'Where Simame fits',
        paragraphs: [
          "Simame - Laundry Connect is a laundry app for Ghana that puts partner laundries in one place. In the app you can see each laundry's services and prices, book pickup and delivery, pay with Mobile Money or card, and follow your order's status from collection to delivery. It is free to download on Google Play.",
        ],
      },
    ],
    faqs: [
      {
        question: 'Is it cheaper to pay per kilo or per item?',
        answer:
          'It depends on what you send. Per-kilo pricing usually works out better for bulky everyday items like T-shirts, towels and bedsheets. Per-item pricing is usually better when you only have a few shirts or formal pieces. If a laundry offers both, compare them using your own typical load.',
      },
      {
        question: 'How do I find a laundry service near me in Ghana?',
        answer:
          "Ask neighbours for recommendations, search a map, or use a laundry app. In the Simame app you can browse partner laundries near your location, compare their services and prices, and book pickup and delivery from your phone.",
      },
      {
        question: 'What should I do if a laundry damages my clothes?',
        answer:
          "Report it straight away with photos and your order record, and check the laundry's policy for how long you have to report a problem. If you booked through Simame, use Report an Issue on that order in the app.",
      },
    ],
  },
  {
    slug: 'dry-cleaning-vs-washing',
    title: 'Dry cleaning vs washing: which clothes need dry cleaning?',
    metaTitle: 'Dry Cleaning vs Washing: Which Clothes Need Dry Cleaning?',
    description:
      'What dry cleaning actually is, how to read care labels, and which clothes, from suits and silk to kente and African print, should be dry cleaned, washed or pressed.',
    summary:
      'What dry cleaning is, how to read the care label, and how to handle suits, silk, kente and African print.',
    datePublished: '2026-09-29',
    dateModified: '2026-09-29',
    readingMinutes: 6,
    sections: [
      {
        heading: 'What dry cleaning actually is',
        paragraphs: [
          'Dry cleaning is not completely dry. Clothes are cleaned in a liquid solvent instead of water, in a machine built for that solvent. Because the fibres are not soaked in water, dry cleaning greatly reduces the shrinking, stretching, dye bleeding and loss of shape that water can cause in some fabrics. Garments are then pressed and finished, usually on hangers.',
          'Washing uses water and detergent, by hand or in a machine. For most everyday cotton and synthetic clothing, washing is the right choice. It is cheaper and handles sweat and water-based dirt better.',
        ],
      },
      {
        heading: 'Start with the care label',
        paragraphs: [
          'The care label sewn into the garment is your best guide. The main symbols to know are:',
        ],
        bullets: [
          'A washtub means the item can be washed in water. Dots inside show the maximum temperature, and a hand in the tub means hand wash only.',
          'A washtub with a cross through it means do not wash in water.',
          'A plain circle means professional cleaning. A letter inside, usually P or F, tells the cleaner which solvent to use. A W inside the circle means professional wet cleaning.',
          'A circle with a cross through it means do not dry clean.',
          '"Dry clean only" is a firm instruction. "Dry clean" on its own is often a recommendation, and a careful hand wash may be possible. If in doubt, ask a professional.',
        ],
      },
      {
        heading: 'Clothes that usually need dry cleaning',
        bullets: [
          'Tailored suits, blazers and structured jackets, where water can distort the canvas and padding inside.',
          'Wool trousers, coats and knitwear that is labelled dry clean.',
          'Silk, velvet, taffeta and satin, which can water-mark, lose their sheen or change texture.',
          'Garments with beading, sequins, stones, heavy embroidery or glued trims.',
          'Lined dresses and gowns, where the lining and outer fabric can shrink by different amounts.',
          'Leather and suede, which need a specialist cleaner rather than a normal dry cleaner.',
        ],
      },
      {
        heading: 'Kente, smocks and African print',
        paragraphs: [
          'Hand-woven cloth such as kente is often sent for professional cleaning because some threads can bleed colour and the weave can loosen or distort if it is scrubbed or wrung. If you clean kente at home, use cold water and a mild detergent, test a hidden corner first, do not wring or scrub, and dry it flat in the shade.',
          'Smocks (fugu or batakari) are heavy hand-woven cotton. Many can be gently hand washed in cold water, but test for colour bleeding first and dry them in the shade.',
          'Wax print and other cotton African prints can normally be washed. To keep the colours bright, wash them inside out in cold water, separately the first few times, avoid chlorine bleach, and dry them out of direct sun.',
        ],
      },
      {
        heading: 'Clothes that are fine to wash',
        paragraphs: [
          'Cotton T-shirts, jeans, most polyester and blended shirts, gym wear, bedsheets and towels are made for washing. Follow the temperature on the label, wash darks and colours separately from whites, and turn printed or dark items inside out.',
        ],
      },
      {
        heading: 'Where ironing and pressing fit',
        paragraphs: [
          'Ironing and steam pressing are finishing steps, not cleaning. Many laundries offer them on their own for clothes that are already clean, or together with washing. Never iron over a stain: heat can set it permanently. Point out stains to your laundry before cleaning so they can be treated first.',
        ],
      },
      {
        heading: 'Storing clothes after dry cleaning',
        paragraphs: [
          'Take clothes out of the thin plastic covers when you get home. The plastic traps moisture, which in a humid climate can lead to mildew and yellowing. Store them on proper hangers in a breathable cloth cover instead.',
        ],
      },
      {
        heading: 'Booking dry cleaning with Simame',
        paragraphs: [
          'In the Simame - Laundry Connect app you can choose a partner laundry that offers dry cleaning, see its prices for items like suits and dresses, and book pickup and delivery. The app is free on Google Play.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Can I wash a "dry clean only" garment at home?',
        answer:
          'It is risky. "Dry clean only" means the maker expects water to damage the fabric, shape or finish. You may get away with it on some simple fabrics, but suits, silk, structured and embellished garments should go to a professional.',
      },
      {
        question: 'Does dry cleaning remove all stains?',
        answer:
          'No. Dry cleaning is good at oil- and grease-based stains, but water-based stains such as sweat, sugary drinks and some foods may need spot treatment before or after. Tell your cleaner what caused the stain and roughly how old it is.',
      },
      {
        question: 'Is dry cleaning more expensive than washing?',
        answer:
          'Usually, yes. Dry cleaning needs special equipment and more hand finishing, so it is normally priced per item, while wash and fold is often priced by weight or by bag.',
      },
    ],
  },
  {
    slug: 'how-to-remove-common-stains',
    title: 'How to remove common stains: palm oil, red soil, sweat, ink and more',
    metaTitle: 'How to Remove Palm Oil, Red Soil, Sweat and Ink Stains',
    description:
      'Step-by-step stain removal for stains common in Ghana: palm oil and stew, red soil and mud, sweat, ink, blood, tomato and pepper sauce, and makeup, plus when to take clothes to a professional.',
    summary:
      'Step-by-step fixes for palm oil, red soil, sweat, ink, blood and sauce stains, and when to call a professional.',
    datePublished: '2026-09-29',
    dateModified: '2026-09-29',
    readingMinutes: 7,
    sections: [
      {
        heading: 'The rules that apply to every stain',
        bullets: [
          'Act quickly. Fresh stains come out far more easily than old ones.',
          'Blot, do not rub. Rubbing pushes the stain deeper and spreads it.',
          'Test any remover on a hidden area such as an inside seam first.',
          'Work from the back of the fabric so the stain is pushed out, not through.',
          'Avoid heat until the stain is completely gone. Hot water, the sun, a dryer or an iron can set a stain permanently.',
          'Check the care label. Silk, wool, kente and "dry clean only" items should go to a professional.',
        ],
      },
      {
        heading: 'Palm oil, stew and soup stains',
        paragraphs: [
          'Red palm oil stains are both greasy and strongly coloured, so treat the grease first and the colour second.',
        ],
        steps: [
          'Scrape off any excess with a spoon. If the stain is still wet, sprinkle a little cornflour or baking soda on it, wait 15 minutes, then brush it off to lift some of the oil.',
          'Work a few drops of liquid dishwashing soap into the stain with your fingers or a soft brush. Dish soap is made to break down grease.',
          'Rinse with warm water, as warm as the care label allows.',
          'Wash as normal, then check the stain before drying. If orange colour remains, repeat. On white cotton, a soak in oxygen bleach can lift the last of the colour. Do not use chlorine bleach on coloured fabrics.',
        ],
      },
      {
        heading: 'Red soil, laterite dust and mud',
        steps: [
          'Let mud dry completely, then brush or shake off as much as you can.',
          'Rub liquid detergent into what remains and leave it for 10 to 15 minutes.',
          'Soak in cold water, then wash as normal.',
          'Check before drying and repeat if needed. Red soil is rich in iron. For stubborn rust-coloured marks on white fabric, use a rust remover made for laundry and avoid chlorine bleach, which can make iron stains darker.',
        ],
      },
      {
        heading: 'Sweat and yellow underarm stains',
        steps: [
          'Make a paste of baking soda and a little water, or use a mix of white vinegar and water.',
          'Rub it into the stain and leave it for 30 minutes to an hour.',
          'Wash in the warmest water the care label allows.',
          'Avoid chlorine bleach on sweat stains. It can react with the proteins in sweat and make the yellowing worse.',
        ],
      },
      {
        heading: 'Ballpoint pen ink',
        steps: [
          'Put a clean cloth or paper towel under the stain.',
          'Dab the ink with rubbing alcohol on a cotton ball. Keep moving to a clean part of the cotton as the ink lifts.',
          'Rinse, apply a little liquid detergent, then wash as normal.',
          'Test the alcohol on a hidden area first, and do not use it on acetate or triacetate fabrics.',
        ],
      },
      {
        heading: 'Blood',
        steps: [
          'Rinse from the back with cold water as soon as possible. Never use hot water, which cooks the protein into the fabric.',
          'Soak in cold water with an enzyme ("bio") detergent for 30 minutes.',
          'Wash in cool water and check before drying.',
        ],
      },
      {
        heading: 'Tomato, shito and pepper sauce',
        steps: [
          'Scrape off the excess and rinse from the back with cold water.',
          'Treat any oil with dishwashing soap, as for palm oil.',
          'Apply liquid detergent to what remains, then dab with white vinegar if colour is left behind.',
          'Wash as normal. On white cotton, drying in sunlight can help fade the last traces of tomato colour, but only once you are sure the oil has gone.',
        ],
      },
      {
        heading: 'Makeup and foundation',
        paragraphs: [
          'Foundation and lipstick are oil-based. Dab with a little dishwashing soap or micellar water, rinse, and wash as normal. Fresh deodorant marks on dark clothes can often be removed by rubbing the mark with a dry sock or a clean pair of tights.',
        ],
      },
      {
        heading: 'When to hand it to a professional',
        paragraphs: [
          'Take the garment to a professional cleaner if it is silk, wool, kente, lace or beaded, if the label says "dry clean only", if the stain is large or old, or if home treatment has not worked. Tell the cleaner what caused the stain, how old it is and anything you have already tried, because some home treatments change how a professional needs to handle it.',
          'With the Simame - Laundry Connect app you can book a partner laundry to collect stained items from your door. Add a note on the order about the stain so it can be treated first.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Does palm oil come out of white clothes?',
        answer:
          'Usually, yes, if you treat it before it is dried or ironed. Remove the grease with dishwashing soap and warm water first, then wash. If an orange tint remains on white cotton, an oxygen bleach soak often removes it.',
      },
      {
        question: 'Why should I avoid hot water on stains?',
        answer:
          'Heat sets many stains, especially protein stains like blood, egg and sweat, by bonding them to the fibres. Start with cold water, and only use warm water once you know what the stain is.',
      },
      {
        question: 'Can I use bleach on every stain?',
        answer:
          'No. Chlorine bleach can damage coloured fabric, can make sweat and rust stains worse, and should never be used on silk or wool. Oxygen bleach is gentler, but test it on a hidden area first.',
      },
    ],
  },
  {
    slug: 'laundry-guide-for-university-students-in-ghana',
    title: 'Laundry guide for university students in Ghana',
    metaTitle: 'Hostel Laundry Guide for University Students in Ghana',
    description:
      'Practical laundry tips for students in hostels and halls in Ghana: a weekly routine, hand washing in a bucket, drying without fading, keeping track of clothes, budgeting and using a pickup service.',
    summary:
      'A weekly routine, bucket washing, drying without fading, and how to budget for laundry in a hostel.',
    datePublished: '2026-09-29',
    dateModified: '2026-09-29',
    readingMinutes: 6,
    sections: [
      {
        heading: 'Pick a laundry day and protect it',
        paragraphs: [
          'The easiest way to stay on top of laundry in a hostel or hall is to give it a fixed slot, such as Saturday morning, when water pressure is often better and you are not rushing to lectures. Clothes left in a heap for two weeks are harder to wash, take longer to dry and are more likely to smell. Plan ahead of exams and assignment deadlines, when laundry is the first thing to slip.',
        ],
      },
      {
        heading: 'Sort before you wash',
        bullets: [
          'Whites and light colours together.',
          'Darks together, turned inside out.',
          'New clothes, especially new African print, washed on their own the first few times in case the dye runs.',
          'Towels and bedsheets on their own, because they hold a lot of water and dirt.',
        ],
      },
      {
        heading: 'Hand washing in a bucket, done properly',
        steps: [
          'Dissolve the detergent in water before adding clothes, so powder does not leave white patches.',
          'Soak for 15 to 30 minutes. Soaking does a lot of the work for you.',
          'Wash the dirtiest areas first: collars, cuffs, underarms and the knees of trousers.',
          'Rinse twice in clean water. Leftover detergent makes clothes stiff and can irritate skin.',
          'Squeeze gently instead of twisting hard, which stretches the fabric.',
        ],
      },
      {
        heading: 'Drying without fading',
        paragraphs: [
          'Strong sun dries clothes quickly but fades dark and bright colours. Dry darks and prints inside out or in the shade, and bring clothes in once they are dry rather than leaving them on the line overnight, where they can collect dew, dust or walk away. Hanging shirts on hangers to dry saves you a lot of ironing.',
          'During the harmattan, dust settles on anything left outside. Shake clothes out before folding and keep clean clothes covered or in a closed bag.',
        ],
      },
      {
        heading: 'Keep track of what is yours',
        paragraphs: [
          'Clothes go missing from shared lines and from laundry bags. Mark labels with your initials using a laundry marker, keep a simple count of what you send out, and take a photo of the pile before handing it over to anyone.',
        ],
      },
      {
        heading: 'Budgeting: what to wash yourself and what to send out',
        paragraphs: [
          'Many students hand wash small daily items such as underwear, socks and T-shirts, and send out the heavy or awkward things: bedsheets, towels, jeans, and anything that needs ironing for presentations or church. Sharing a pickup with a roommate can also help if the laundry charges a delivery fee.',
        ],
      },
      {
        heading: 'Using a laundry pickup service on campus',
        paragraphs: [
          'A pickup and delivery service means you do not have to carry heavy bags across campus. Schedule collection around your lectures, keep your phone on so the rider can reach you, and check your items when they come back.',
          "Simame - Laundry Connect lets you book partner laundries for pickup and delivery from your phone where service is available near you. Simame is an independent company and is not affiliated with any university. Download the app free on Google Play and check which laundries serve your hostel or area.",
        ],
      },
    ],
    faqs: [
      {
        question: 'How often should students do laundry?',
        answer:
          'Once a week suits most students. Towels and bedsheets should be washed at least every one to two weeks, and gym clothes after every use.',
      },
      {
        question: 'How do I stop my clothes from fading in the sun?',
        answer:
          'Turn dark and printed clothes inside out, dry them in the shade where possible, and bring them in as soon as they are dry. Washing in cold water also helps colours last.',
      },
      {
        question: 'Can I book laundry pickup at my hostel?',
        answer:
          'Many laundries offer hostel pickup. In the Simame app you can see partner laundries near your location and book pickup and delivery where they serve your area.',
      },
    ],
  },
  {
    slug: 'how-to-prepare-clothes-for-laundry-pickup',
    title: 'How to prepare your clothes for laundry pickup',
    metaTitle: 'How to Prepare Clothes for Laundry Pickup and Delivery',
    description:
      'A simple checklist before a laundry pickup: empty pockets, count and photograph items, flag stains and delicates, check care labels, and inspect everything when it comes back.',
    summary:
      'Empty pockets, count and photograph items, flag stains and delicates, and check everything on return.',
    datePublished: '2026-09-29',
    dateModified: '2026-09-29',
    readingMinutes: 4,
    sections: [
      {
        heading: 'Before the rider arrives',
        steps: [
          'Empty every pocket. Pens, lipstick, coins, cards and tissues can ruin a whole load, and a forgotten pen is one of the most common causes of ink damage.',
          'Count your items and write the number down, or note it in your order. Take a quick photo of the pile, and close-ups of anything valuable.',
          'Note existing damage such as loose buttons, small tears or old stains, so it is recorded before cleaning.',
          'Flag stains. Point them out, or add a note saying what caused each one. Cleaners treat a stain better when they know what it is.',
          'Separate delicates and "dry clean only" items into their own bag or clearly mark them.',
          'Remove detachable extras: belts, brooches, removable shoulder pads and anything valuable pinned to a garment.',
          'Close zips and hooks so they do not snag other clothes, and undo buttons to reduce strain on buttonholes.',
          'Use a strong bag that closes, and keep one bag per service if you are sending items for different treatments.',
        ],
      },
      {
        heading: 'At pickup',
        paragraphs: [
          'Be available during your pickup window and keep your phone on so the rider can reach you. Confirm the item count at handover. If you booked through an app, check that the order shows the right address and services before the bag leaves.',
        ],
      },
      {
        heading: 'When your clothes come back',
        paragraphs: [
          'Check the count and look over each item soon after delivery, before you put clothes away. Report anything missing or damaged straight away with photos. Most laundries only accept complaints within a set period after delivery.',
          'If you booked through the Simame - Laundry Connect app, you can follow your order from collection to delivery and use Report an Issue on the order if something is wrong. The app is free on Google Play.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Should I separate my clothes before pickup?',
        answer:
          'Separate anything that needs different treatment: delicates and "dry clean only" items from everyday wash and fold, and new or brightly dyed items that might run. The laundry will sort by colour, but it helps to flag special items.',
      },
      {
        question: 'What if an item is missing when my laundry comes back?',
        answer:
          'Report it straight away with your item count and photos. Laundries usually set a time limit for claims. On Simame, open the order in the app and use Report an Issue.',
      },
    ],
  },
]

export function getGuideBySlug(slug: string) {
  return GUIDES.find((guide) => guide.slug === slug) ?? null
}
