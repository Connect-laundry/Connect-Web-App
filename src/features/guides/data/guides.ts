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
  {
    slug: 'how-to-keep-white-clothes-white',
    title: 'How to keep white clothes white',
    metaTitle: 'How to Keep White Clothes White (and Fix Yellowing)',
    description:
      'Why white clothes turn grey or yellow and how to fix it: sorting, water temperature, the right amount of detergent, oxygen vs chlorine bleach, laundry blue, borehole water and drying in the sun.',
    summary:
      'Why whites go grey or yellow, and how to fix it with sorting, the right detergent dose, bleach used safely and the sun.',
    datePublished: '2026-09-29',
    dateModified: '2026-09-29',
    readingMinutes: 5,
    sections: [
      {
        heading: 'Why whites go grey or yellow',
        paragraphs: [
          'White clothes rarely turn dull overnight. It happens slowly, through dye picked up from other clothes in the wash, detergent and body oils that are never fully rinsed out, sweat that builds up in collars and underarms, and minerals in the water. Once you know which one is the cause, the fix is usually simple.',
        ],
      },
      {
        heading: 'Wash whites only with whites',
        paragraphs: [
          'Even a light grey T-shirt or a pair of blue jeans releases a little dye every wash, and white fabric picks it up. Keep a separate bag or basket for whites and wash them together, never with colours.',
        ],
      },
      {
        heading: 'Use enough water, heat and rinsing, but not too much detergent',
        bullets: [
          'Cotton whites can usually take warmer water than colours. Check the care label and use the warmest temperature it allows.',
          'Do not overload the machine or bucket. Clothes need room to move for dirt to wash out.',
          'More detergent does not mean cleaner clothes. Too much leaves a film that traps dirt and makes whites look grey. Use the amount on the pack, and rinse twice when hand washing.',
          'Pre-treat collars, cuffs and underarms with a little liquid detergent before washing.',
        ],
      },
      {
        heading: 'Bleach: oxygen first, chlorine with care',
        paragraphs: [
          'Oxygen bleach (sodium percarbonate, sold as powder or in "oxy" products) is the safest way to brighten whites. Dissolve it in warm water and soak whites for a few hours or overnight before washing.',
          'Chlorine bleach is stronger but harsher. Use it only on white cotton and linen whose label allows it, always diluted, and never on silk, wool, spandex or anything with coloured trim. It can make sweat stains and iron-based stains worse.',
          'Never mix chlorine bleach with vinegar, ammonia or other cleaning products. The combination releases toxic gas.',
        ],
      },
      {
        heading: 'Laundry blue',
        paragraphs: [
          'Laundry blue, a traditional whitener still widely used in Ghana, adds a tiny amount of blue that cancels out a yellow tint, so whites look brighter. Dissolve it fully in the final rinse water and use very little, stirring well before adding clothes, or it can leave blue streaks.',
        ],
      },
      {
        heading: 'Borehole and well water',
        paragraphs: [
          'Water with a lot of iron, common in some borehole and well water, can slowly turn whites yellow or leave orange spots, and chlorine bleach makes this worse by turning the iron into rust marks. If your water leaves orange stains in buckets or sinks, wash whites in treated or filtered water where you can, and use oxygen bleach instead of chlorine.',
        ],
      },
      {
        heading: 'Let the sun help',
        paragraphs: [
          'Sunlight gently bleaches white cotton, so hang whites in direct sun (the opposite of what you should do with colours). Bring them in once dry, and store whites only when they are completely clean and dry, because stains left in fabric darken over time.',
        ],
      },
      {
        heading: 'Let a laundry handle it',
        paragraphs: [
          'Work shirts, school uniforms and white bedsheets can be sent to a laundry for proper washing and pressing. With the Simame - Laundry Connect app you can book a partner laundry near you for pickup and delivery. It is free on Google Play.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Why do my white shirts turn yellow under the arms?',
        answer:
          'Sweat and some antiperspirants build up in the fabric. Pre-treat with a paste of baking soda and water, then soak in oxygen bleach and wash warm. Avoid chlorine bleach on these stains, as it can make the yellow darker.',
      },
      {
        question: 'Can I use chlorine bleach on all white clothes?',
        answer:
          'No. Only use it on white cotton or linen whose care label allows bleach, always diluted. Never use it on silk, wool, spandex or whites with coloured details.',
      },
      {
        question: 'Does drying whites in the sun really help?',
        answer:
          'Yes. Sunlight has a mild bleaching effect on white cotton and helps it look brighter. Keep coloured clothes out of direct sun, because the same effect fades them.',
      },
    ],
  },
  {
    slug: 'how-to-wash-african-print-fabric',
    title: 'How to wash African print so the colours last',
    metaTitle: 'How to Wash African Print Without Fading',
    description:
      'How to wash, dry, iron and store African wax print and ankara clothes so the colours stay bright, plus why you should pre-wash fabric before your tailor sews it.',
    summary:
      'Pre-washing before the tailor, cold hand washing, drying in the shade and ironing on the reverse to keep prints bright.',
    datePublished: '2026-09-29',
    dateModified: '2026-09-29',
    readingMinutes: 5,
    sections: [
      {
        heading: 'Pre-wash fabric before it goes to the tailor',
        paragraphs: [
          'Cotton wax print can shrink slightly the first time it is washed. If a tailor sews it straight from the shop, the finished dress or shirt can end up a little tighter or shorter after its first wash, and seams can pucker.',
          'To avoid that, wash the fabric once in cold or lukewarm water, dry it in the shade and iron it before handing it to the tailor. This also removes excess dye and some of the stiffness from the finishing.',
        ],
      },
      {
        heading: 'Wash it gently, in cold water',
        steps: [
          'Turn the garment inside out to protect the printed face.',
          'Wash separately, or only with similar colours, for the first few washes in case dye runs. A colour-catcher sheet in the wash helps.',
          'Use cold water and a mild detergent. Hot water speeds up fading.',
          'Hand wash, or use a gentle machine cycle. Do not leave the garment soaking for hours.',
          'Never use chlorine bleach on printed fabric.',
          'Squeeze out the water gently instead of twisting hard.',
        ],
      },
      {
        heading: 'Dry in the shade',
        paragraphs: [
          'Strong sun is the fastest way to fade a print. Dry African print inside out, in the shade or somewhere with good airflow, and bring it in as soon as it is dry.',
        ],
      },
      {
        heading: 'Iron on the reverse side',
        paragraphs: [
          'Iron while the fabric is still slightly damp, on the cotton setting, with the garment inside out. Ironing the printed face directly can leave shiny patches. For embellished styles, press around beads and sequins, or put a thin cloth between the iron and the garment.',
        ],
      },
      {
        heading: 'Store it away from light',
        paragraphs: [
          'Keep print clothes in a wardrobe or a cloth bag, out of direct light, and only when fully dry. Kente and other hand-woven cloth are best folded with a sheet of acid-free tissue or a clean cotton cloth between the folds. For how to clean kente itself, see our dry cleaning guide.',
        ],
      },
      {
        heading: 'When to send it out',
        paragraphs: [
          'Heavily embellished outfits, lined styles, special-occasion kaba and slit, and anything with a "dry clean only" label are safest with a professional. With the Simame - Laundry Connect app you can book a partner laundry near you for pickup and delivery. It is free on Google Play.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Does African print shrink?',
        answer:
          'Cotton wax print can shrink slightly in its first wash. Pre-wash the fabric in cold or lukewarm water, dry it and iron it before your tailor cuts it.',
      },
      {
        question: 'Why is my African print fading?',
        answer:
          'The usual causes are hot water, strong detergent, drying in direct sun and ironing on the printed side. Wash cold and inside out, dry in the shade and iron on the reverse.',
      },
      {
        question: 'Can I machine wash wax print?',
        answer:
          'Usually yes, on a gentle cycle in cold water, turned inside out. Check the label, and keep embellished or lined styles for hand washing or professional cleaning.',
      },
    ],
  },
  {
    slug: 'how-to-stop-clothes-smelling-musty',
    title: 'How to stop clothes smelling musty in the rainy season',
    metaTitle: 'How to Stop Clothes Smelling Musty in the Rainy Season',
    description:
      'Why clothes smell damp or musty after washing, especially in the rainy season, how to dry them properly indoors, and how to remove the smell and mildew spots.',
    summary:
      'Why clothes smell damp after washing, how to dry them indoors, and how to remove musty smells and mildew.',
    datePublished: '2026-09-29',
    dateModified: '2026-09-29',
    readingMinutes: 5,
    sections: [
      {
        heading: 'Why clean clothes can smell',
        paragraphs: [
          'That damp, musty smell comes from mildew and bacteria that grow when fabric stays wet for too long. In the rainy season, clothes can take a day or more to dry, which is plenty of time for the smell to start. Towels and thick fabrics such as jeans are usually the first to go.',
        ],
      },
      {
        heading: 'Get the water out quickly',
        bullets: [
          'Hang clothes as soon as washing finishes. Never leave wet laundry sitting in a machine or bucket.',
          'Use the fastest spin your machine allows, or wring by hand firmly (but not so hard that you stretch delicate items).',
          'Wash smaller loads in the rainy season so there is less to dry at once.',
        ],
      },
      {
        heading: 'Drying indoors',
        bullets: [
          'Leave space between items on the line or rack so air can move around them.',
          'Put the rack by an open window or in the path of a fan. Moving air matters more than heat.',
          'Hang shirts and dresses on hangers, and turn thick items halfway through.',
          'Check that seams, pockets and waistbands are dry before you fold anything. They are always the last parts to dry.',
        ],
      },
      {
        heading: 'Removing a musty smell',
        steps: [
          'Rewash the item with your normal detergent.',
          'Add about a cup of white vinegar to the rinse water. Do not use vinegar and chlorine bleach together.',
          'For towels that still smell after washing, run a second wash with half a cup of baking soda.',
          'Dry completely, in the sun if the fabric and colours allow it.',
        ],
      },
      {
        heading: 'Dealing with mildew spots',
        paragraphs: [
          'Black or grey mildew spots should be brushed off outdoors first, so the spores do not spread. Pre-treat with liquid detergent and wash in the warmest water the label allows. On white cotton, an oxygen bleach soak helps. Mildew that has been in fabric for a long time can leave permanent marks, so act quickly.',
        ],
      },
      {
        heading: 'Keep your wardrobe dry',
        paragraphs: [
          'Do not pack clothes in too tightly, keep the wardrobe a little away from damp outside walls, and use moisture absorbers such as silica gel sachets or charcoal bags. Air the wardrobe on dry days.',
          'In long rainy spells, a laundry with commercial dryers can return clothes fully dry. With the Simame - Laundry Connect app you can book a partner laundry near you for pickup and delivery. It is free on Google Play.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Why do my towels smell even after washing?',
        answer:
          'Detergent and body oils build up in towels and hold moisture, so bacteria keep growing. Wash towels warm with less detergent, add vinegar to the rinse, and make sure they dry fully between uses.',
      },
      {
        question: 'Is it bad to dry clothes indoors?',
        answer:
          'No, as long as there is airflow. Open a window or use a fan, space items out, and avoid drying in a closed room with no ventilation.',
      },
      {
        question: 'Can vinegar damage my clothes?',
        answer:
          'Diluted white vinegar in the rinse is safe for most washable fabrics. Avoid pouring it undiluted onto delicate fabric, and never mix it with chlorine bleach.',
      },
    ],
  },
  {
    slug: 'how-to-iron-a-shirt',
    title: 'How to iron a shirt properly',
    metaTitle: 'How to Iron a Shirt Properly, Step by Step',
    description:
      'A step-by-step guide to ironing a dress shirt: iron temperature settings, the right order (collar, cuffs, sleeves, yoke, back, front), dark shirts, and tips to iron less.',
    summary:
      'Temperature settings, the right order for collar, cuffs, sleeves and body, and how to iron less.',
    datePublished: '2026-09-29',
    dateModified: '2026-09-29',
    readingMinutes: 4,
    sections: [
      {
        heading: 'Check the temperature first',
        paragraphs: [
          'The iron symbol on the care label tells you how hot to go. One dot means low heat, for synthetics such as nylon and acrylic. Two dots means medium, for polyester, silk and wool. Three dots means high, for cotton and linen. An iron with a cross through it means do not iron. For poly-cotton blends, use the lower setting.',
        ],
      },
      {
        heading: 'Iron slightly damp',
        paragraphs: [
          'Creases come out far more easily when the fabric is slightly damp. Use the steam setting, or mist the shirt with a spray bottle of clean water. Make sure the iron plate is clean, because residue on the plate can mark a white shirt.',
        ],
      },
      {
        heading: 'The order that works',
        steps: [
          'Collar: iron the underside first, from the points towards the middle, then the top side.',
          'Cuffs: unbutton them, iron the inside, then the outside.',
          'Sleeves: lay each sleeve flat along its seam, smooth it with your hand, and iron from the shoulder down to the cuff. Turn it over and repeat.',
          'Yoke and shoulders: slip one shoulder over the narrow end of the ironing board and iron, then do the other.',
          'Back: lay the back flat across the board and iron from top to bottom.',
          'Front panels: iron each side, working the tip of the iron around the buttons rather than over them.',
        ],
      },
      {
        heading: 'Finish and hang',
        paragraphs: [
          'Put the shirt straight on a hanger and fasten the top button so the collar keeps its shape. Let it cool for a few minutes before you wear it. Warm fabric creases again easily.',
        ],
      },
      {
        heading: 'Dark and delicate shirts',
        paragraphs: [
          'Dark cotton, and fabrics like polyester and silk, can turn shiny under a hot iron. Iron them inside out, or put a thin cotton cloth between the iron and the shirt.',
        ],
      },
      {
        heading: 'How to iron less',
        bullets: [
          'Take shirts out of the wash promptly and shake them out.',
          'Dry shirts on hangers, buttoned at the top, instead of folding them over a line.',
          'Iron several shirts in one session while the iron is hot, and when power is available, so you are covered for the week.',
          'Send work shirts out for washing and pressing. With the Simame - Laundry Connect app you can book a partner laundry near you for pickup and delivery. It is free on Google Play.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What temperature should I iron a cotton shirt at?',
        answer:
          'Cotton takes the highest setting (three dots). Use steam or iron the shirt while slightly damp for the best result. For poly-cotton blends, drop to the medium setting.',
      },
      {
        question: 'Why does my iron leave shiny marks?',
        answer:
          'The iron is too hot for the fabric, or you are pressing directly on dark or synthetic fabric. Lower the heat, iron inside out, or use a pressing cloth.',
      },
    ],
  },
]

export function getGuideBySlug(slug: string) {
  return GUIDES.find((guide) => guide.slug === slug) ?? null
}
