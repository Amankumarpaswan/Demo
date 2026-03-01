
'use client';

import { useState, ChangeEvent, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Music, Heart, ArrowRight, Crown, ArrowLeft, Camera, Lock, Sparkles, Loader2, Star, Calendar, PartyPopper, Baby, Users, Trash2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CreateCelebration() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState({
    category: searchParams.get('category') || 'SPECIAL',
    mode: 'FREE',
    isForSelf: true,
    names: '',
    count: '',
    relationLabel: '',
    occasion: '',
    creatorName: '',
    creatorPhoto: null as string | null,
    photos: [] as string[],
    music: null as string | null,
    customMessage: '',
    theme: 'ROYAL',
    selectedLanguage: 'hindi' as 'hindi' | 'english',
    selectedTemplate: 1 as 1 | 2 | 3 | 4,
    generatedAIQuote: '',
    specialSubcategory: '' as 'JYANTI' | 'DIVAS' | 'FESTIVALS' | 'NEW_MEMBERS' | 'MARRIAGE_DATE_FIX' | '',
    occasionName: '',
    occasionDate: '',
    occasionTime: '',
    fatherName: '',
    motherName: '',
    name1: '',
    name2: '',
    whoAreYou: 'HUSBAND' as 'HUSBAND' | 'WIFE' | 'MALE_PARTNER' | 'FEMALE_PARTNER',
  });

  const [isGeneratingQuote, setIsGeneratingQuote] = useState(false);
  const [previousQuotes, setPreviousQuotes] = useState<string[]>([]);
  const emotionalTermRef = useRef<string>('');
  const babyTermRef = useRef<string>('');
  const coupleTermRef = useRef<string>('');
  const usedBabyTerms = useRef<string[]>([]);
  const usedCoupleTerms = useRef<string[]>([]);

  // ─────────────────────────────────────────────────────────────
  // TASK 1 — UNIVERSAL BACK BUTTON (BULLETPROOF ARCHITECTURE)
  //
  // DESIGN PRINCIPLE — Single Source of Truth:
  //   The browser's popstate event is THE ONLY place that calls
  //   setCurrentStep when going backward. No other code path
  //   touches state during back navigation. This eliminates the
  //   previous double-decrement bug where handleBack() called
  //   both setCurrentStep AND history.back() (which fired popstate
  //   which called setCurrentStep a second time).
  //
  // HISTORY STACK MANAGEMENT:
  //   • On mount:   replaceState({ jashnWizard:true, step:0 })
  //                 Stamps the current entry (does NOT add to stack)
  //   • On forward: pushState({ jashnWizard:true, step:N })
  //                 Adds exactly one entry per step. Going back
  //                 then forward truncates the forward stack via
  //                 native browser behavior — no duplicates possible.
  //   • On back:    ONLY window.history.back() is called.
  //                 popstate fires → handler reads e.state.step →
  //                 setCurrentStep(e.state.step). If e.state has no
  //                 jashnWizard key (went past step 0) → go home.
  //
  // LOOP PREVENTION:
  //   Native history.pushState truncates forward entries on each
  //   push, so back→forward→back never creates duplicates.
  //   History is always a clean linear sequence: [home, step0,
  //   step1, step2, ...] with each step appearing exactly once.
  //
  // ALL BACK METHODS UNIFIED:
  //   Hardware button / gesture / browser nav bar / keyboard →
  //   all fire the popstate event → handled identically.
  //   Virtual back button → calls window.history.back() → popstate.
  //   One code path. Zero duplication.
  // ─────────────────────────────────────────────────────────────

  useEffect(() => {
    // Stamp the current browser history entry as wizard step 0.
    // replaceState (not pushState) so we don't add to the stack —
    // the entry behind this one remains the user's previous page.
    window.history.replaceState({ jashnWizard: true, step: 0 }, '');

    const onPopState = (e: PopStateEvent) => {
      if (e.state && e.state.jashnWizard === true) {
        // Moved to a wizard entry — sync React state to its step
        setCurrentStep(e.state.step as number);
      } else {
        // Moved past all wizard entries (behind step 0) → exit to home
        window.location.href = '/';
      }
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []); // Runs once. setCurrentStep is stable (React guarantee).

  // Keyboard back: Alt+Left (universal) + Backspace (when not typing)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const inTextField =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        window.history.back();
      } else if (e.key === 'Backspace' && !inTextField) {
        e.preventDefault();
        window.history.back();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const getStepFlow = () => {
    if (formData.category === 'SPECIAL') {
      return [0, 2, 3, 4, 5];
    } else {
      return [1, 2, 3, 4, 5];
    }
  };

  const getCurrentStepValue = () => {
    const flow = getStepFlow();
    return flow[currentStep] || 0;
  };

  const handleNext = () => {
    const flow = getStepFlow();
    const isLastStep = currentStep >= flow.length - 1;

    if (isLastStep) {
      if ((formData.category === 'MARRIAGE' || formData.category === 'RELATIONSHIP') && formData.isForSelf) {
        const term = getRandomEmotionalTerm();
        emotionalTermRef.current = term;
      }

      // Baby terms for New Member - BOTH For Me AND For Other
      if (formData.specialSubcategory === 'NEW_MEMBERS') {
        const term = getBabyTerm();
        babyTermRef.current = term;
      }

      // Couple terms for Wedding Date - BOTH For Me AND For Other
      if (formData.specialSubcategory === 'MARRIAGE_DATE_FIX') {
        const term = getCoupleTerm();
        coupleTermRef.current = term;
      }

      let finalFormData = { ...formData };
      if (formData.isForSelf && !formData.creatorName) {
        if (formData.category === 'BIRTHDAY') {
          finalFormData = { ...finalFormData, creatorName: formData.names || '' };
        } else if (formData.specialSubcategory === 'NEW_MEMBERS') {
          if (formData.fatherName || formData.motherName) {
            finalFormData = { ...finalFormData, creatorName: formData.fatherName || formData.motherName };
          }
        } else if (formData.specialSubcategory === 'MARRIAGE_DATE_FIX') {
          if (formData.name1 || formData.name2) {
            finalFormData = { ...finalFormData, creatorName: formData.name1 || formData.name2 };
          }
        }
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('celebrationData', JSON.stringify(finalFormData));
        localStorage.setItem('emotionalTerm', emotionalTermRef.current);
        localStorage.setItem('babyTerm', babyTermRef.current);
        localStorage.setItem('coupleTerm', coupleTermRef.current);
      }
      if (formData.mode === 'PREMIUM' && formData.category !== 'SPECIAL') {
        router.push('/celebrate/premium');
      } else {
        router.push('/celebrate/preview');
      }
    } else {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      // Push a history entry stamped with the new step number.
      // Native pushState truncates any forward entries — so if the
      // user went back then forward, the old forward entry is gone
      // before the new one is added. No duplicates, no loops.
      window.history.pushState({ jashnWizard: true, step: nextStep }, '');
    }
  };

  const getRandomEmotionalTerm = () => {
    let terms: string[] = [];

    if (formData.category === 'MARRIAGE') {
      if (formData.whoAreYou === 'HUSBAND') {
        terms = [
          "My Beautiful Wife", "My Better Half", "My Life Partner",
          "My Soulmate", "My Queen", "My Everything",
          "My World", "My Love", "My Beloved Wife"
        ];
      } else {
        terms = [
          "My Handsome Husband", "My Better Half", "My Life Partner",
          "My Soulmate", "My King", "My Everything",
          "My World", "My Love", "My Beloved Husband"
        ];
      }
    } else if (formData.category === 'RELATIONSHIP') {
      if (formData.whoAreYou === 'MALE_PARTNER') {
        terms = [
          "My Cute Girl", "My Pretty Love", "My Heart's Beat",
          "My Sweetheart", "My Jaan", "My Sunshine",
          "My Forever Crush", "My Princess", "My Baby"
        ];
      } else {
        terms = [
          "My Cute Boy", "My Handsome Love", "My Heart's Beat",
          "My Sweetheart", "My Jaan", "My Sunshine",
          "My Forever Crush", "My Prince", "My Baby"
        ];
      }
    }

    const availableTerms = terms.filter(t => t !== emotionalTermRef.current);
    return availableTerms[Math.floor(Math.random() * availableTerms.length)] || terms[0];
  };

  // Baby term generation for New Member
  const getBabyTerm = () => {
    const terms = [
      "My Baby", "Little One", "Tiny Human", "Sweet One", "Small Joy",
      "Pure Love", "New Life", "Little Soul", "Mini Human", "Baby Love",
      "Tiny Joy", "Little Smile", "Small Wonder", "Pure Joy", "Little Miracle"
    ];

    const availableTerms = terms.filter(t => !usedBabyTerms.current.includes(t));

    if (availableTerms.length === 0) {
      usedBabyTerms.current = [];
      availableTerms.push(...terms);
    }

    const term = availableTerms[Math.floor(Math.random() * availableTerms.length)];
    usedBabyTerms.current.push(term);

    return term;
  };

  // Couple term generation for Wedding Date
  const getCoupleTerm = () => {
    const terms = [
      "Baby On Way", "Baby Coming Soon", "Little One Coming",
      "New Member Coming", "Mini Human Loading", "Tiny Boss Coming",
      "Sleep Gone Soon", "Parents Upgrade Loading"
    ];

    const availableTerms = terms.filter(t => !usedCoupleTerms.current.includes(t));

    if (availableTerms.length === 0) {
      usedCoupleTerms.current = [];
      availableTerms.push(...terms);
    }

    const term = availableTerms[Math.floor(Math.random() * availableTerms.length)];
    usedCoupleTerms.current.push(term);

    return term;
  };

  const getOrdinal = (n: string) => {
    const s = ["th", "st", "nd", "rd"];
    const v = parseInt(n) || 0;
    const v100 = v % 100;
    return n + (s[(v100 - 20) % 10] || s[v100] || s[0]);
  };

  // TASK 8/9/11: Separate templates for "For Yourself" (SELF) and "For Others" (OTHER)
  const SELF_TEMPLATES = {
    BIRTHDAY: {
      1: {
        hindi: `आज मेरा [Age]वाँ जन्मदिन है। हे प्रभु, मेरी अब तक की भूलों को क्षमा करें और आगे मुझे सद्बुद्धि व सन्मार्ग पर चलने की शक्ति दें।`,
        english: `Today is my [Age]th birthday. Dear God, please forgive my past mistakes and grant me wisdom and the strength to walk on the right path ahead.`
      },
      2: {
        hindi: `ईश्वर की कृपा से आज मेरे जीवन के [Age] वर्ष पूर्ण हुए। मेरी गलतियों को माफ करें और आने वाला जीवन शुभ, सफल व मंगलमय बनाएं।`,
        english: `By God's grace, [Age] years of my life are complete today. Please forgive my mistakes and bless the life ahead to be auspicious, successful, and joyful.`
      },
      3: {
        hindi: `आज [Age] वर्ष पूरे होने पर मैं ईश्वर के चरणों में नमन करता हूँ। हे भगवान, मेरी रक्षा करें और आगे मेरे लिए अच्छा ही अच्छा हो, ऐसी कृपा करें।`,
        english: `On completing [Age] years today, I bow at God's feet. O Lord, protect me and bless me so that only good things come my way from here on.`
      }
    },
    RELATIONSHIP: {
      1: {
        hindi: `आज हमारी रिलेशनशिप एनिवर्सरी है। हे भगवान, इतना अच्छा जीवनसाथी देने के लिए धन्यवाद, हमारा रिश्ता सदा प्रेम व विश्वास से भरा रहे।`,
        english: `Today is our relationship anniversary. Thank you, God, for such a wonderful partner — may our relationship always be filled with love and trust.`
      },
      2: {
        hindi: `ईश्वर का आभार है कि आपने हमें एक-दूसरे से जोड़ा। हमारे रिश्ते पर अपनी कृपा बनाए रखें और जीवन को सुखमय करें।`,
        english: `We are grateful to God for bringing us together. Please continue to bless our relationship and make our lives filled with happiness.`
      },
      3: {
        hindi: `आज हमारे प्रेम संबंध का पावन दिन है। हे प्रभु, हमारा साथ यूँ ही बना रहे और हमारे जीवन में हमेशा शांति रहे।`,
        english: `Today is the sacred day of our love bond. O Lord, may we always stay together and may there always be peace in our lives.`
      }
    },
    MARRIAGE: {
      1: {
        hindi: `आज हमारी विवाह वर्षगांठ है। हे ईश्वर, इतने अच्छे जीवनसाथी के लिए धन्यवाद, हमारे वैवाहिक जीवन को सदा सुखी रखें।`,
        english: `Today is our wedding anniversary. Thank you, God, for such a wonderful life partner — please keep our married life always happy.`
      },
      2: {
        hindi: `भगवान की कृपा से आज हम अपनी शादी की सालगिरह मना रहे हैं। हम दोनों पर अपनी अनुकंपा बनाए रखें और जीवन को आनंदमय करें।`,
        english: `By God's grace, we are celebrating our wedding anniversary today. Please continue to shower your blessings on us both and fill our life with joy.`
      },
      3: {
        hindi: `आज हमारे दांपत्य जीवन का एक और पवित्र वर्ष पूर्ण हुआ। हे प्रभु, हमारे रिश्ते में प्रेम, समझ और समर्पण बनाए रखें।`,
        english: `Another sacred year of our married life is complete today. O Lord, please keep love, understanding, and dedication in our relationship.`
      }
    }
  };

  const TEMPLATES = {
    MARRIAGE: {
      1: {
        hindi: `[Years] वर्षों के इस पवित्र बंधन पर [Name] को दिल से हार्दिक बधाई और अनेक शुभकामनाएं।`,
        english: `Heartfelt congratulations and best wishes to [Name] on [Years] years of this sacred bond.`
      },
      2: {
        hindi: `[Years] वर्षों से प्यार, समर्पण और विश्वास का सुंदर सफर तय करते हुए [Name] को विवाह वर्षगांठ की हार्दिक शुभकामनाएं।`,
        english: `Warmest wishes to [Name] on their wedding anniversary, celebrating [Years] beautiful years of love, devotion, and trust.`
      },
      3: {
        hindi: `[Name] को [Years]वीं विवाह वर्षगांठ की बहुत-बहुत बधाई।`,
        english: `Heartiest congratulations to [Name] on their [Years]th wedding anniversary.`
      }
    },
    RELATIONSHIP: {
      1: {
        hindi: `[Years] वर्षों से साथ, समझ और प्यार का यह सफर [Name] के लिए हमेशा मुस्कुराहटों से भरा रहे।`,
        english: `May this beautiful journey of [Years] years of companionship, understanding, and love continue to bring smiles to [Name].`
      },
      2: {
        hindi: `[Years] वर्षों की खूबसूरत बॉन्डिंग के लिए [Name] को दिल से बधाई और शुभकामनाएं।`,
        english: `Heartfelt congratulations and best wishes to [Name] for [Years] years of beautiful bonding.`
      },
      3: {
        hindi: `[Name] को [Years]वीं रिलेशनशिप एनिवर्सरी मुबारक।`,
        english: `Happy [Years]th relationship anniversary to [Name].`
      }
    },
    BIRTHDAY: {
      1: {
        hindi: `[Name] को जन्मदिन के इस खास अवसर पर ढेर सारी बधाई, खुशियां और उज्जवल भविष्य की शुभकामनाएं।`,
        english: `Heartiest congratulations to [Name] on this special birthday, with wishes for happiness and a bright future ahead.`
      },
      2: {
        hindi: `इस नए साल के साथ [Name] के जीवन में और अधिक सफलता, स्वास्थ्य और खुशियां आएं — जन्मदिन मुबारक।`,
        english: `Wishing [Name] greater success, good health, and happiness in the coming year — Happy Birthday.`
      },
      3: {
        hindi: `[Name] को जन्मदिन की हार्दिक बधाई और शुभकामनाएं।`,
        english: `Heartfelt birthday wishes to [Name].`
      }
    },
    JYANTI: {
      1: {
        hindi: `[Naam] की जयंती पर उनके विचारों और आदर्शों को नमन।`,
        english: `Salutations to the thoughts and ideals of [Naam] on their birth anniversary.`
      },
      2: {
        hindi: `[Naam] के जीवन और संघर्ष से प्रेरित होकर, आज हम उनकी जयंती पर श्रद्धांजलि अर्पित करते हैं।`,
        english: `Inspired by the life and struggles of [Naam], we offer our tribute on their birth anniversary today.`
      },
      3: {
        hindi: `[Naam] जयंती पर शत-शत नमन।`,
        english: `Respectful salutations on [Naam] Jayanti.`
      }
    },
    DIVAS: {
      1: {
        hindi: `[Divas ka Naam] के अवसर पर इसके महत्व को समझें और इसे अपने जीवन का हिस्सा बनाएं।`,
        english: `On the occasion of [Divas ka Naam], let us understand its importance and make it a part of our lives.`
      },
      2: {
        hindi: `[Divas ka Naam] हमें जिम्मेदारी, जागरूकता और सकारात्मक बदलाव की याद दिलाता है।`,
        english: `[Divas ka Naam] reminds us of responsibility, awareness, and positive change.`
      },
      3: {
        hindi: `[Divas ka Naam] पर देश और समाज के प्रति अपनी जिम्मेदारी को याद करें।`,
        english: `Remember your responsibility towards the nation and society on [Divas ka Naam].`
      }
    },
    FESTIVALS: {
      1: {
        hindi: `इस पवित्र अवसर पर आप और आपके परिवार को [Festival Name] की हार्दिक शुभकामनाएं।`,
        english: `Heartfelt wishes to you and your family on the sacred occasion of [Festival Name].`
      },
      2: {
        hindi: `[Festival Name] के शुभ अवसर पर सुख, शांति और समृद्धि आपके जीवन में बनी रहे।`,
        english: `May happiness, peace, and prosperity remain in your life on the auspicious occasion of [Festival Name].`
      },
      3: {
        hindi: `खुशियों और उमंग से भरा [Festival Name] आपके जीवन को रोशन करे।`,
        english: `May [Festival Name] filled with joy and enthusiasm illuminate your life.`
      }
    },
    NEW_MEMBERS: {
      forOther: {
        1: {
          hindi: `[Date] को [Time] पर [Father Name] और [Mother Name] के परिवार में एक नए सदस्य का आगमन हुआ। इस शुभ अवसर पर ढेर सारी बधाइयां।`,
          english: `A new member arrived in the family of [Father Name] and [Mother Name] on [Date] at [Time]. Heartiest congratulations on this auspicious occasion.`
        },
        2: {
          hindi: `भगवान की कृपा से [Date] को [Time] पर [Father Name] और [Mother Name] के घर एक नन्हे मेहमान का आगमन हुआ। परिवार को हार्दिक शुभकामनाएं।`,
          english: `By God's grace, a little guest arrived at [Father Name] and [Mother Name]'s home on [Date] at [Time]. Heartfelt wishes to the family.`
        },
        3: {
          hindi: `[Father Name] और [Mother Name] के घर [Date] को [Time] पर खुशियों ने दस्तक दी — नए सदस्य के आगमन पर बधाई।`,
          english: `Happiness knocked on [Father Name] and [Mother Name]'s door on [Date] at [Time] — congratulations on the arrival of a new member.`
        }
      },
      forMe: {
        1: {
          hindi: `[Date] को [Time] पर हमारे परिवार में एक नए सदस्य का स्वागत। इस खुशी को आपके साथ साझा करते हुए हर्ष हो रहा है।`,
          english: `Welcoming a new member to our family on [Date] at [Time]. Delighted to share this joy with you.`
        },
        2: {
          hindi: `भगवान की कृपा से [Date] को [Time] पर हमारे घर एक नन्हे फरिश्ते का आगमन हुआ। आपके आशीर्वाद की अपेक्षा है।`,
          english: `By God's grace, a little angel arrived at our home on [Date] at [Time]. Seeking your blessings.`
        },
        3: {
          hindi: `[Date] को [Time] पर हमारे जीवन में खुशियों का नया अध्याय शुरू हुआ — नए सदस्य के स्वागत में।`,
          english: `A new chapter of happiness began in our lives on [Date] at [Time] — welcoming our new family member.`
        }
      }
    },
    MARRIAGE_DATE_FIX: {
      forOther: {
        1: {
          hindi: `खुशी के साथ सूचित किया जाता है कि [Name 1] और [Name 2] के विवाह की शुभ तिथि [Date] निश्चित हुई है। आशीर्वाद अपेक्षित।`,
          english: `It is joyfully announced that the auspicious wedding date of [Name 1] and [Name 2] has been fixed on [Date]. Blessings are awaited.`
        },
        2: {
          hindi: `दो परिवारों की रज़ा और आशीर्वाद से [Name 1] और [Name 2] के शुभ विवाह की तिथि [Date] तय हुई।`,
          english: `With the consent and blessings of two families, the auspicious wedding date of [Name 1] and [Name 2] has been set on [Date].`
        },
        3: {
          hindi: `प्यार और परंपरा के संगम के साथ [Name 1] और [Name 2] के विवाह की शुभ तिथि [Date] निश्चित हुई।`,
          english: `With the union of love and tradition, the auspicious wedding date of [Name 1] and [Name 2] has been fixed on [Date].`
        }
      },
      forMe: {
        1: {
          hindi: `हर्ष के साथ सूचित करते हैं कि हमारे विवाह की शुभ तिथि [Date] निश्चित हुई है। आप सभी का आशीर्वाद और उपस्थिति अपेक्षित है।`,
          english: `We are delighted to announce that our wedding date has been fixed on [Date]. Your blessings and presence are requested.`
        },
        2: {
          hindi: `परिवार और मित्रों के आशीर्वाद से हमारे विवाह की शुभ तिथि [Date] तय हुई है। आपकी उपस्थिति से यह दिन और भी खास होगा।`,
          english: `With the blessings of family and friends, our wedding date has been set on [Date]. Your presence will make this day more special.`
        },
        3: {
          hindi: `नए जीवन की शुरुआत करते हुए, हमारे विवाह की शुभ तिथि [Date] निश्चित की है। आप सभी को निमंत्रण एवं आशीर्वाद की अपेक्षा।`,
          english: `Beginning a new life together, we have fixed our wedding date on [Date]. Inviting you all with request for blessings.`
        }
      }
    }
  };

  const fillPlaceholders = (template: string, data = formData): string => {
    let filled = template;

    if (data.category === 'MARRIAGE' || data.category === 'RELATIONSHIP') {
      if (data.isForSelf) {
        filled = filled.replace(/\[Name\]/g, data.names || '[Name]');
      } else {
        filled = filled.replace(/\[Name\]/g, data.relationLabel || data.names || '[Name]');
      }
    } else {
      filled = filled.replace(/\[Name\]/g, data.names || '[Name]');
    }

    filled = filled.replace(/\[Years\]/g, data.count || '[Years]');
    filled = filled.replace(/\[Age\]/g, data.count || '[Age]');
    filled = filled.replace(/\[Naam\]/g, data.occasionName || '[Naam]');
    filled = filled.replace(/\[Divas ka Naam\]/g, data.occasionName || '[Divas ka Naam]');
    filled = filled.replace(/\[Festival Name\]/g, data.occasionName || '[Festival Name]');
    filled = filled.replace(/\[Date\]/g, data.occasionDate || '[Date]');
    filled = filled.replace(/\[Time\]/g, data.occasionTime || '[Time]');
    filled = filled.replace(/\[Father Name\]/g, data.fatherName || '[Father Name]');
    filled = filled.replace(/\[Mother Name\]/g, data.motherName || '[Mother Name]');
    filled = filled.replace(/\[Name 1\]/g, data.name1 || '[Name 1]');
    filled = filled.replace(/\[Name 2\]/g, data.name2 || '[Name 2]');

    return filled;
  };

  const getPreviewForTemplate = (templateNum: 1 | 2 | 3): string => {
    let templateKey = formData.category;
    if (formData.category === 'SPECIAL') {
      templateKey = formData.specialSubcategory;
    }

    if (formData.isForSelf && (formData.category === 'MARRIAGE' || formData.category === 'RELATIONSHIP' || formData.category === 'BIRTHDAY')) {
      const selfTemplates = (SELF_TEMPLATES as any)[formData.category];
      if (selfTemplates && selfTemplates[templateNum]) {
        const rawTemplate = selfTemplates[templateNum][formData.selectedLanguage] || '';
        return fillPlaceholders(rawTemplate);
      }
    }

    const templates = TEMPLATES[templateKey as keyof typeof TEMPLATES];
    if (!templates) return 'Enter details to preview';

    let template;

    if (templateKey === 'NEW_MEMBERS' || templateKey === 'MARRIAGE_DATE_FIX') {
      const subTemplates = templates as any;
      template = formData.isForSelf ? subTemplates.forMe[templateNum] : subTemplates.forOther[templateNum];
    } else {
      template = (templates as any)[templateNum];
    }

    if (!template) return '';

    const rawTemplate = template[formData.selectedLanguage] || '';
    return fillPlaceholders(rawTemplate);
  };

  const generateAIQuote = async () => {
    setIsGeneratingQuote(true);
    setFormData(prev => ({ ...prev, generatedAIQuote: '' }));

    try {
      const response = await fetch('/api/generate-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occasion: formData.category,
          language: formData.selectedLanguage,
          isForSelf: formData.isForSelf,
          subcategory: formData.specialSubcategory,
          targetName: formData.isForSelf ? formData.names : formData.relationLabel,
          years: formData.count,
          age: formData.count,
          occasionName: formData.occasionName,
          previousQuotes: previousQuotes,
          timestamp: Date.now()
        })
      });

      const data = await response.json();

      if (data.fallback) {
        console.log('Using fallback quote');
      }

      const newQuote = data.quote;
      setFormData(prev => ({ ...prev, generatedAIQuote: newQuote }));
      setPreviousQuotes(prev => [...prev, newQuote]);

    } catch (error: any) {
      console.error('AI Error:', error);
      alert('Quote generation failed. Please try again.');
    } finally {
      setIsGeneratingQuote(false);
    }
  };

  const getCurrentQuote = () => {
    if (formData.selectedTemplate === 4) {
      return fillPlaceholders(formData.generatedAIQuote || '');
    }
    return getPreviewForTemplate(formData.selectedTemplate as 1 | 2 | 3);
  };

  useEffect(() => {
    const stepValue = getCurrentStepValue();
    if (stepValue === 4) {
      const quote = getCurrentQuote();
      if (quote && quote !== 'Enter details to preview') {
        setFormData(prev => ({ ...prev, customMessage: quote }));
      }
    }
  }, [currentStep, formData.selectedTemplate, formData.selectedLanguage]);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>, type: 'PHOTO' | 'MUSIC' | 'CREATOR') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (type === 'MUSIC') {
      setFormData(prev => ({ ...prev, music: URL.createObjectURL(files[0]) }));
    } else if (type === 'CREATOR') {
      setFormData(prev => ({ ...prev, creatorPhoto: URL.createObjectURL(files[0]) }));
    } else {
      const remainingSlots = 5 - formData.photos.length;
      if (remainingSlots <= 0) {
        alert('Maximum 5 images allowed');
        return;
      }

      const filesToAdd = Array.from(files).slice(0, remainingSlots);
      const newPhotos = filesToAdd.map(file => URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, photos: [...prev.photos, ...newPhotos] }));
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const renderInput = (placeholder: string, value: string, key: string, type: string = "text") => (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => setFormData({ ...formData, [key]: e.target.value })}
      className="w-full bg-[#2A0A0A]/40 border border-[#d4af37]/30 p-4 rounded-xl text-white outline-none focus:border-[#d4af37] transition-colors placeholder:text-white/30"
    />
  );

  const stepValue = getCurrentStepValue();

  const needsForMeForOther = formData.specialSubcategory === 'NEW_MEMBERS' || formData.specialSubcategory === 'MARRIAGE_DATE_FIX';
  const showForMeForOther = (formData.category !== 'SPECIAL' || needsForMeForOther);

  const showWhoAreYou = (formData.category === 'MARRIAGE' || formData.category === 'RELATIONSHIP') && formData.isForSelf;

  return (
    <div className="fixed inset-0 w-full h-[100dvh] overflow-y-auto no-scrollbar">
      <div className="absolute top-10 left-0 right-0 w-full flex justify-center z-20 pointer-events-none">
        <div className="w-full max-w-xs h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#d4af37]"
            animate={{ width: `${((currentStep + 1) / getStepFlow().length) * 100}%` }}
          />
        </div>
      </div>

      <div className="min-h-full flex flex-col items-center justify-center p-6 gap-8 pb-32">
        <div className="w-full max-w-md min-h-[400px] flex items-center justify-center mt-10">
          <AnimatePresence mode='wait'>

            {/* STEP 0: Select Celebration Type (Special Date only) */}
            {stepValue === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full space-y-4"
              >
                <h2 className="text-3xl font-serif text-[#d4af37] mb-8 text-center">Select Celebration Type</h2>

                <div className="flex flex-wrap gap-3 justify-center">
                  {[
                    { key: 'JYANTI', label: 'Jayanti', icon: Star },
                    { key: 'DIVAS', label: 'Special Day', icon: Calendar },
                    { key: 'FESTIVALS', label: 'Festivals', icon: PartyPopper },
                    { key: 'NEW_MEMBERS', label: 'New Member', icon: Baby },
                    { key: 'MARRIAGE_DATE_FIX', label: 'Wedding Date', icon: Users }
                  ].map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setFormData({ ...formData, specialSubcategory: key as any, mode: 'FREE' })}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-200 font-semibold text-sm ${
                        formData.specialSubcategory === key
                          ? 'bg-[#d4af37] text-[#2A0A0A] border-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                          : 'bg-[#3D1010]/40 text-white/80 border-[#d4af37]/20 hover:border-[#d4af37]/60 hover:bg-[#d4af37]/10'
                      }`}
                    >
                      <Icon size={16} />
                      {label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 1: Select Style */}
            {stepValue === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full">
                <h2 className="text-3xl font-serif text-[#d4af37] mb-8 text-center">Select Style</h2>
                <div onClick={() => setFormData({ ...formData, mode: 'FREE' })} className={`p-6 mb-4 rounded-xl border transition-all cursor-pointer ${formData.mode === 'FREE' ? 'bg-[#d4af37]/20 border-[#d4af37]' : 'glass-panel border-white/10 opacity-70 hover:opacity-100'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-white text-lg">Story Mode</span>
                    <Heart size={20} className="text-pink-500" />
                  </div>
                  <p className="text-white/60 text-sm">Best for celebrations.</p>
                </div>
                <div onClick={() => setFormData({ ...formData, mode: 'PREMIUM' })} className={`p-6 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${formData.mode === 'PREMIUM' ? 'bg-gradient-to-br from-[#d4af37]/10 to-[#3D1010]/80 border-[#d4af37]' : 'glass-panel border-white/10 opacity-70 hover:opacity-100'}`}>
                  <div className="absolute top-0 right-0 bg-[#d4af37] text-[#2A0A0A] text-[10px] font-bold px-2 py-1">PREMIUM</div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-[#d4af37] text-lg flex items-center gap-2"><Crown size={18} /> Web Page Mode</span>
                  </div>
                  <p className="text-white/60 text-sm">Full Landing Page experience.</p>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Enter Details */}
            {stepValue === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full space-y-5">
                <h2 className="text-2xl font-serif text-[#d4af37] text-center mb-4">Enter Details</h2>

                {showForMeForOther && (
                  <div className="flex bg-[#3D1010]/50 p-1 rounded-full border border-white/10 mb-6">
                    <button
                      onClick={() => setFormData({ ...formData, isForSelf: true })}
                      className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${formData.isForSelf ? 'bg-[#d4af37] text-[#2A0A0A]' : 'text-white/50'}`}
                    >
                      For Yourself
                    </button>
                    <button
                      onClick={() => setFormData({ ...formData, isForSelf: false })}
                      className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${!formData.isForSelf ? 'bg-[#d4af37] text-[#2A0A0A]' : 'text-white/50'}`}
                    >
                      For Other
                    </button>
                  </div>
                )}

                {formData.category === 'SPECIAL' && (
                  <>
                    {formData.specialSubcategory === 'JYANTI' && (
                      <>
                        {renderInput("Jayanti Name (e.g., Gandhi Jayanti)", formData.occasionName, 'occasionName')}
                        {renderInput("Date (e.g., 2 October)", formData.occasionDate, 'occasionDate')}
                        <div className="flex gap-3">
                          {renderInput("Your Name (Creator)", formData.creatorName, 'creatorName')}
                          <label className="w-14 h-[58px] flex-shrink-0 bg-[#2A0A0A]/40 border border-[#d4af37]/30 rounded-xl flex items-center justify-center cursor-pointer hover:bg-[#d4af37]/10 transition-colors overflow-hidden">
                            {formData.creatorPhoto ? <img src={formData.creatorPhoto} className="w-full h-full object-cover" alt="" /> : <Camera size={20} className="text-[#d4af37]" />}
                            <input type="file" accept="image/*" hidden onChange={(e) => handleFileUpload(e, 'CREATOR')} />
                          </label>
                        </div>
                      </>
                    )}

                    {formData.specialSubcategory === 'DIVAS' && (
                      <>
                        {renderInput("Day Name (e.g., World Environment Day)", formData.occasionName, 'occasionName')}
                        {renderInput("Date (e.g., 5 June)", formData.occasionDate, 'occasionDate')}
                        <div className="flex gap-3">
                          {renderInput("Your Name (Creator)", formData.creatorName, 'creatorName')}
                          <label className="w-14 h-[58px] flex-shrink-0 bg-[#2A0A0A]/40 border border-[#d4af37]/30 rounded-xl flex items-center justify-center cursor-pointer hover:bg-[#d4af37]/10 transition-colors overflow-hidden">
                            {formData.creatorPhoto ? <img src={formData.creatorPhoto} className="w-full h-full object-cover" alt="" /> : <Camera size={20} className="text-[#d4af37]" />}
                            <input type="file" accept="image/*" hidden onChange={(e) => handleFileUpload(e, 'CREATOR')} />
                          </label>
                        </div>
                      </>
                    )}

                    {formData.specialSubcategory === 'FESTIVALS' && (
                      <>
                        {renderInput("Festival Name (e.g., Diwali)", formData.occasionName, 'occasionName')}
                        {renderInput("Date (e.g., 12 November)", formData.occasionDate, 'occasionDate')}
                        <div className="flex gap-3">
                          {renderInput("Your Name (Creator)", formData.creatorName, 'creatorName')}
                          <label className="w-14 h-[58px] flex-shrink-0 bg-[#2A0A0A]/40 border border-[#d4af37]/30 rounded-xl flex items-center justify-center cursor-pointer hover:bg-[#d4af37]/10 transition-colors overflow-hidden">
                            {formData.creatorPhoto ? <img src={formData.creatorPhoto} className="w-full h-full object-cover" alt="" /> : <Camera size={20} className="text-[#d4af37]" />}
                            <input type="file" accept="image/*" hidden onChange={(e) => handleFileUpload(e, 'CREATOR')} />
                          </label>
                        </div>
                      </>
                    )}

                    {formData.specialSubcategory === 'NEW_MEMBERS' && (
                      <>
                        {renderInput("Date (e.g., 15 March 2024)", formData.occasionDate, 'occasionDate')}
                        {renderInput("Time (e.g., 10:30 AM)", formData.occasionTime, 'occasionTime')}
                        {renderInput("Father's Name", formData.fatherName, 'fatherName')}
                        {renderInput("Mother's Name", formData.motherName, 'motherName')}
                        {!formData.isForSelf && (
                          <div className="flex gap-3">
                            {renderInput("Your Name (Creator)", formData.creatorName, 'creatorName')}
                            <label className="w-14 h-[58px] flex-shrink-0 bg-[#2A0A0A]/40 border border-[#d4af37]/30 rounded-xl flex items-center justify-center cursor-pointer hover:bg-[#d4af37]/10 transition-colors overflow-hidden">
                              {formData.creatorPhoto ? <img src={formData.creatorPhoto} className="w-full h-full object-cover" alt="" /> : <Camera size={20} className="text-[#d4af37]" />}
                              <input type="file" accept="image/*" hidden onChange={(e) => handleFileUpload(e, 'CREATOR')} />
                            </label>
                          </div>
                        )}
                      </>
                    )}

                    {formData.specialSubcategory === 'MARRIAGE_DATE_FIX' && (
                      <>
                        {renderInput("Bride/Groom Name", formData.name1, 'name1')}
                        {renderInput("Groom/Bride Name", formData.name2, 'name2')}
                        {renderInput("Wedding Date (e.g., 20 December 2024)", formData.occasionDate, 'occasionDate')}
                        {!formData.isForSelf && (
                          <div className="flex gap-3">
                            {renderInput("Your Name (Creator)", formData.creatorName, 'creatorName')}
                            <label className="w-14 h-[58px] flex-shrink-0 bg-[#2A0A0A]/40 border border-[#d4af37]/30 rounded-xl flex items-center justify-center cursor-pointer hover:bg-[#d4af37]/10 transition-colors overflow-hidden">
                              {formData.creatorPhoto ? <img src={formData.creatorPhoto} className="w-full h-full object-cover" alt="" /> : <Camera size={20} className="text-[#d4af37]" />}
                              <input type="file" accept="image/*" hidden onChange={(e) => handleFileUpload(e, 'CREATOR')} />
                            </label>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}

                {(formData.category === 'MARRIAGE' || formData.category === 'RELATIONSHIP') && (
                  <>
                    {renderInput(formData.isForSelf ? "Partner's Name" : "Couple Name", formData.names, 'names')}
                    {renderInput("Years? (e.g. 5)", formData.count, 'count', 'number')}
                    {!formData.isForSelf && renderInput("Your Relation (e.g. Bhaiya & Bhabhi)", formData.relationLabel, 'relationLabel')}

                    {showWhoAreYou && (
                      <div className="pt-4 border-t border-white/10">
                        <p className="text-[#d4af37] text-sm font-bold mb-3">Who Are You?</p>
                        <div className="flex gap-3">
                          {formData.category === 'MARRIAGE' ? (
                            <>
                              <label className="flex-1 cursor-pointer">
                                <input
                                  type="radio"
                                  name="whoAreYou"
                                  value="HUSBAND"
                                  checked={formData.whoAreYou === 'HUSBAND'}
                                  onChange={() => setFormData({ ...formData, whoAreYou: 'HUSBAND' })}
                                  className="hidden"
                                />
                                <div className={`p-3 rounded-xl border text-center transition-all ${formData.whoAreYou === 'HUSBAND' ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37]' : 'border-white/10 text-white/50'}`}>
                                  Husband
                                </div>
                              </label>
                              <label className="flex-1 cursor-pointer">
                                <input
                                  type="radio"
                                  name="whoAreYou"
                                  value="WIFE"
                                  checked={formData.whoAreYou === 'WIFE'}
                                  onChange={() => setFormData({ ...formData, whoAreYou: 'WIFE' })}
                                  className="hidden"
                                />
                                <div className={`p-3 rounded-xl border text-center transition-all ${formData.whoAreYou === 'WIFE' ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37]' : 'border-white/10 text-white/50'}`}>
                                  Wife
                                </div>
                              </label>
                            </>
                          ) : (
                            <>
                              <label className="flex-1 cursor-pointer">
                                <input
                                  type="radio"
                                  name="whoAreYou"
                                  value="MALE_PARTNER"
                                  checked={formData.whoAreYou === 'MALE_PARTNER'}
                                  onChange={() => setFormData({ ...formData, whoAreYou: 'MALE_PARTNER' })}
                                  className="hidden"
                                />
                                <div className={`p-3 rounded-xl border text-center transition-all ${formData.whoAreYou === 'MALE_PARTNER' ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37]' : 'border-white/10 text-white/50'}`}>
                                  Male Partner
                                </div>
                              </label>
                              <label className="flex-1 cursor-pointer">
                                <input
                                  type="radio"
                                  name="whoAreYou"
                                  value="FEMALE_PARTNER"
                                  checked={formData.whoAreYou === 'FEMALE_PARTNER'}
                                  onChange={() => setFormData({ ...formData, whoAreYou: 'FEMALE_PARTNER' })}
                                  className="hidden"
                                />
                                <div className={`p-3 rounded-xl border text-center transition-all ${formData.whoAreYou === 'FEMALE_PARTNER' ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37]' : 'border-white/10 text-white/50'}`}>
                                  Female Partner
                                </div>
                              </label>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {formData.category === 'BIRTHDAY' && (
                  <>
                    {renderInput("Birthday Person Name", formData.names, 'names')}
                    {renderInput("Which Birthday? (e.g. 20)", formData.count, 'count', 'number')}
                    {!formData.isForSelf && renderInput("Your Relation", formData.relationLabel, 'relationLabel')}
                  </>
                )}

                {/* Creator details for "For Others" - name + photo always together */}
                {!formData.isForSelf && formData.category !== 'SPECIAL' && (
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <p className="text-[#d4af37] text-xs uppercase tracking-widest text-center mb-2">Creator Details</p>
                    <div className="flex gap-3">
                      {renderInput("Your Name", formData.creatorName, 'creatorName')}
                      <label className="w-14 h-[58px] flex-shrink-0 bg-[#2A0A0A]/40 border border-[#d4af37]/30 rounded-xl flex items-center justify-center cursor-pointer hover:bg-[#d4af37]/10 transition-colors overflow-hidden">
                        {formData.creatorPhoto ? <img src={formData.creatorPhoto} className="w-full h-full object-cover" alt="" /> : <Camera size={20} className="text-[#d4af37]" />}
                        <input type="file" accept="image/*" hidden onChange={(e) => handleFileUpload(e, 'CREATOR')} />
                      </label>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 3: Memories & Tunes */}
            {stepValue === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full space-y-6 text-center">
                <h2 className="text-2xl font-serif text-[#d4af37]">Memories & Tunes</h2>
                <label className="flex items-center justify-center gap-3 w-full p-4 border border-dashed border-white/30 rounded-xl cursor-pointer hover:bg-white/5 transition-colors">
                  <Music className="text-[#d4af37]" />
                  <span className="text-white/70 text-sm flex items-center gap-2">
                    {formData.music ? (
                      <>
                        Music Added
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="7" fill="#4ade80" fillOpacity="0.2" stroke="#4ade80" strokeWidth="1.5"/>
                          <path d="M4.5 8L7 10.5L11.5 6" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </>
                    ) : "Upload Song"}
                  </span>
                  <input type="file" accept="audio/*" hidden onChange={(e) => handleFileUpload(e, 'MUSIC')} />
                </label>

                <div className="space-y-3">
                  <label className={`block w-full p-8 border-2 border-dashed rounded-xl transition-colors ${formData.photos.length >= 5 ? 'opacity-50 cursor-not-allowed border-white/20' : 'border-[#d4af37]/40 cursor-pointer hover:bg-[#d4af37]/10'}`}>
                    <Upload className="mx-auto text-[#d4af37] mb-2" />
                    <span className="text-white/70">Upload Photos ({formData.photos.length}/5)</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      hidden
                      onChange={(e) => handleFileUpload(e, 'PHOTO')}
                      disabled={formData.photos.length >= 5}
                    />
                  </label>

                  {formData.photos.length >= 5 && (
                    <p className="text-yellow-500 text-xs">Maximum 5 images allowed</p>
                  )}
                </div>

                <div className="flex gap-2 overflow-x-auto py-2 no-scrollbar">
                  {formData.photos.map((img, i) => (
                    <div key={i} className="relative flex-shrink-0">
                      <img src={img} className="w-16 h-16 object-cover rounded-lg border border-white/20" alt="" />
                      <button
                        onClick={() => removePhoto(i)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 4: Choose Message */}
            {stepValue === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full space-y-4">
                <h2 className="text-2xl font-serif text-[#d4af37] text-center">Choose Message</h2>

                <div className="flex justify-center gap-2 mb-4">
                  <button onClick={() => setFormData({ ...formData, selectedLanguage: 'hindi' })} className={`px-4 py-2 rounded-lg text-sm font-bold ${formData.selectedLanguage === 'hindi' ? 'bg-[#d4af37] text-[#2A0A0A]' : 'bg-white/10 text-white/50'}`}>हिंदी</button>
                  <button onClick={() => setFormData({ ...formData, selectedLanguage: 'english' })} className={`px-4 py-2 rounded-lg text-sm font-bold ${formData.selectedLanguage === 'english' ? 'bg-[#d4af37] text-[#2A0A0A]' : 'bg-white/10 text-white/50'}`}>English</button>
                </div>

                <div className="space-y-3">
                  <p className="text-white/50 text-xs uppercase tracking-widest text-center">Select Template</p>

                  {[1, 2, 3].map((num) => (
                    <div key={num} onClick={() => setFormData({ ...formData, selectedTemplate: num as 1 | 2 | 3 })} className={`p-4 rounded-xl border cursor-pointer ${formData.selectedTemplate === num ? 'bg-[#d4af37]/20 border-[#d4af37]' : 'border-white/10'}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${formData.selectedTemplate === num ? 'border-[#d4af37] bg-[#d4af37]' : 'border-white/30'}`}>
                          {formData.selectedTemplate === num && <div className="w-2 h-2 bg-[#2A0A0A] rounded-full" />}
                        </div>
                        <p className="text-white/90 text-sm leading-relaxed font-['Georgia',serif]">{getPreviewForTemplate(num as 1 | 2 | 3)}</p>
                      </div>
                    </div>
                  ))}

                  <div onClick={() => setFormData({ ...formData, selectedTemplate: 4 })} className={`p-4 rounded-xl border cursor-pointer ${formData.selectedTemplate === 4 ? 'bg-gradient-to-br from-[#d4af37]/20 to-[#8a6e15]/20 border-[#d4af37]' : 'border-white/10'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${formData.selectedTemplate === 4 ? 'border-[#d4af37] bg-[#d4af37]' : 'border-white/30'}`}>
                        {formData.selectedTemplate === 4 && <div className="w-2 h-2 bg-[#2A0A0A] rounded-full" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles size={16} className="text-[#d4af37]" />
                          <span className="text-[#d4af37] font-bold text-sm">AI Generated</span>
                        </div>
                        {formData.selectedTemplate === 4 && (
                          <>
                            {!formData.generatedAIQuote ? (
                              <button onClick={(e) => { e.stopPropagation(); generateAIQuote(); }} disabled={isGeneratingQuote} className="w-full bg-[#d4af37] text-[#2A0A0A] py-2 px-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                                {isGeneratingQuote ? <><Loader2 size={16} className="animate-spin" />Generating...</> : <><Sparkles size={16} />Free Generate</>}
                              </button>
                            ) : (
                              <div className="space-y-2">
                                <p className="text-white/90 text-sm leading-relaxed font-['Georgia',serif]">{fillPlaceholders(formData.generatedAIQuote)}</p>
                                <button onClick={(e) => { e.stopPropagation(); generateAIQuote(); }} disabled={isGeneratingQuote} className="text-[#d4af37] text-xs underline disabled:opacity-50">
                                  {isGeneratingQuote ? 'Generating...' : 'Regenerate'}
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <p className="text-white/50 text-xs uppercase text-center mb-3">Or Custom</p>
                  <textarea placeholder="Write your own..." value={formData.customMessage} onChange={e => setFormData({ ...formData, customMessage: e.target.value })} className="w-full h-32 bg-[#2A0A0A]/40 border border-[#d4af37]/30 p-4 rounded-xl text-white outline-none focus:border-[#d4af37] resize-none leading-relaxed font-['Georgia',serif]" />
                </div>
              </motion.div>
            )}

            {/* STEP 5: Select Theme */}
            {stepValue === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full space-y-6">
                <h2 className="text-2xl font-serif text-[#d4af37] text-center">Select Theme</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div onClick={() => setFormData({ ...formData, theme: 'ROYAL' })} className={`relative p-4 rounded-xl border-2 cursor-pointer ${formData.theme === 'ROYAL' ? 'border-[#d4af37] bg-[#d4af37]/10' : 'border-white/10 opacity-60'}`}>
                    <div className="h-20 bg-gradient-to-b from-[#2A0A0A] to-[#3D1010] rounded-lg mb-2 flex items-center justify-center border border-[#d4af37]/20"><Crown size={24} className="text-[#d4af37]" /></div>
                    <p className={`text-center font-serif ${formData.theme === 'ROYAL' ? 'text-[#d4af37]' : 'text-white'}`}>Royal Gold</p>
                    {formData.theme === 'ROYAL' && <div className="absolute top-2 right-2 w-3 h-3 bg-[#d4af37] rounded-full shadow-[0_0_10px_#d4af37]" />}
                  </div>
                  {['Cool', 'Minimal', 'Festive'].map((t) => (
                    <div key={t} className="relative p-4 rounded-xl border opacity-50 cursor-not-allowed grayscale">
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="bg-black/80 px-3 py-1 rounded-full flex items-center gap-1 border border-white/10"><Lock size={10} className="text-white/70" /><span className="text-[10px] text-white/70">Soon</span></div>
                      </div>
                      <div className="h-20 bg-gray-800 rounded-lg mb-2" />
                      <p className="text-center text-white/40">{t}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* Virtual back button: calls ONLY history.back() — fires popstate → handler sets step.
          Never calls setCurrentStep directly to prevent double-decrement. */}
      <button
        onClick={() => window.history.back()}
        className="absolute bottom-10 left-10 w-16 h-16 bg-[#3D1010] border border-[#d4af37]/30 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform z-30"
      >
        <ArrowLeft size={24} />
      </button>
      <button
        onClick={handleNext}
        className="absolute bottom-10 right-10 w-16 h-16 bg-[#d4af37] rounded-full flex items-center justify-center text-[#2A0A0A] shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-110 transition-transform z-30"
      >
        <ArrowRight size={28} />
      </button>
    </div>
  );
}
