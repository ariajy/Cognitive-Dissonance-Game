// Scenario content (classic script for file:// compatibility).
// IMPORTANT: Scenario text is used exactly as provided by the user.

(function () {
  const scenarios = [
    {
      id: "missed-deadline",
      episodeLabel: "Scenario 1",
      title: 'Missed Deadline — "I\'ll Start After One More Video"',
      belief: '"I am responsible."',
      beliefId: "responsibility",
      situation:
        "You planned to finish a simple task tonight, but keep watching short videos, telling yourself you still have time.",
      scenario:
        "You planned to finish a simple task tonight, but keep watching short videos, telling yourself you still have time.",
      innerVoices: [
        'Responsibility: "You said you\'d get this done."',
        'Comfort: "One more video won\'t hurt."',
        'Avoidance: "It\'s small, you can rush it later."',
        'Identity: "Responsible people don\'t keep delaying."'
      ],
      decision: "You notice yourself still scrolling instead of starting—what do you do next?",
      decisionAction: {
        actionTags: ["procrastination", "responsibility"],
        beliefImpact: { responsibility: -0.5 },
        strainDelta: +10,
        tone: "conflict"
      },
      primaryChoices: [
        {
          id: "primary-conflict",
          label: "Keep scrolling",
          description: "Keep watching short videos and delay starting, even if it clashes with responsibility.",
          actionTags: ["procrastination", "responsibility"],
          beliefImpact: { responsibility: -0.5 },
          strainDelta: +10,
          tone: "conflict"
        },
        {
          id: "primary-aligned",
          label: "Start for 20 minutes",
          description: "Start the task for 20 minutes to protect responsibility.",
          actionTags: ["procrastination", "responsibility"],
          beliefImpact: { responsibility: 0.25 },
          strainDelta: -5,
          tone: "aligned"
        }
      ],
      reductions: {
        behavior_change: {
          label: "Change Behaviour",
          explanation: "If I start for just 20 minutes, I can still be the kind of person who follows through.",
          actionTags: ["procrastination", "responsibility"],
          baseWeight: 1,
          beliefImpact: { responsibility: +0.5 },
          strainDelta: -15,
          tone: "aligned"
        },
        belief_change: {
          label: "Adjust Belief",
          explanation: "Maybe responsibility is about good intentions, not forcing myself when I’m drained.",
          actionTags: ["procrastination", "responsibility"],
          baseWeight: 1,
          beliefImpact: { responsibility: -0.25 },
          strainDelta: -10,
          tone: "mixed"
        },
        justification: {
          label: "Justify Behaviour",
          explanation: "Today was too much—this delay doesn’t say anything real about me.",
          copingCaveat:
            "This can ease the sting in the moment, but it often weakens how strongly you hold your own standards—and the inconsistency can come back the next time you delay.",
          actionTags: ["procrastination", "responsibility", "avoidance"],
          baseWeight: 1,
          beliefImpact: { responsibility: -0.5 },
          strainDelta: -5,
          tone: "mixed"
        }
      }
    },
    {
      id: "helping-hand",
      episodeLabel: "Scenario 2",
      title: 'Helping Hand — "I\'m Too Busy"',
      belief: '"I am kind and helpful."',
      beliefId: "kindness",
      situation:
        "Your neighbor, who recently helped you move, asks for a quick favor carrying groceries upstairs.",
      scenario:
        "Your neighbor, who recently helped you move, asks for a quick favor carrying groceries upstairs.",
      innerVoices: [
        'Kindness: "They helped you. This matters."',
        "Comfort: \"You finally sat down—don’t get up again.\"",
        'Avoidance: "Someone else will help."',
        'Identity: "Are you really as kind as you say?"'
      ],
      decision: "Your neighbor asks for a quick favor—what do you do next?",
      decisionAction: {
        actionTags: ["helping", "kindness"],
        beliefImpact: { kindness: -0.5 },
        strainDelta: +10,
        tone: "conflict"
      },
      primaryChoices: [
        {
          id: "primary-conflict",
          label: "Ignore the text",
          description: "You stay on the couch and don’t answer, leaving the bags downstairs for now.",
          actionTags: ["helping", "kindness"],
          beliefImpact: { kindness: -0.5 },
          strainDelta: +10,
          tone: "conflict"
        },
        {
          id: "primary-aligned",
          label: "Carry bags up",
          description: "You go help haul the groceries upstairs, even if it cuts your rest short.",
          actionTags: ["helping", "kindness"],
          beliefImpact: { kindness: 0.25 },
          strainDelta: -5,
          tone: "aligned"
        }
      ],
      reductions: {
        behavior_change: {
          label: "Change Behaviour",
          explanation: "It’s inconvenient, but showing up is what kind people do.",
          actionTags: ["helping", "kindness"],
          baseWeight: 1,
          beliefImpact: { kindness: +0.5 },
          strainDelta: -10,
          tone: "aligned"
        },
        belief_change: {
          label: "Adjust Belief",
          explanation: "I can still be kind inside, even if I don’t have energy to act right now.",
          actionTags: ["helping", "kindness"],
          baseWeight: 1,
          beliefImpact: { kindness: -0.25 },
          strainDelta: -5,
          tone: "mixed"
        },
        justification: {
          label: "Justify Behaviour",
          explanation: "They’re asking too much—protecting my rest is reasonable.",
          actionTags: ["helping", "kindness", "avoidance"],
          baseWeight: 1,
          beliefImpact: { kindness: -0.5 },
          strainDelta: -5,
          tone: "conflict"
        }
      }
    },
    {
      id: "white-lie",
      episodeLabel: "Scenario 3",
      title: 'White Lie — "It\'s Harmless"',
      belief: '"I am honest."',
      beliefId: "honesty",
      situation:
        "Your friend asks if you’ve watched their long video project. You watched only the first 2 minutes.",
      scenario:
        "Your friend asks if you’ve watched their long video project. You watched only the first 2 minutes.",
      innerVoices: [
        'Honesty: "Just tell the truth."',
        'Comfort: "Saying yes keeps things smooth."',
        'Avoidance: "If you admit it, they’ll be hurt."',
        'Identity: "Honest people don’t fake praise."'
      ],
      decision: "Your friend asks if you’ve watched it—what do you say next?",
      decisionAction: {
        actionTags: ["ethical", "honesty"],
        beliefImpact: { honesty: -0.5 },
        strainDelta: +10,
        tone: "conflict"
      },
      primaryChoices: [
        {
          id: "primary-conflict",
          label: "Pretend you watched",
          description: "You type that you loved it so the chat stays easy and warm.",
          actionTags: ["ethical", "honesty"],
          beliefImpact: { honesty: -0.5 },
          strainDelta: +10,
          tone: "conflict"
        },
        {
          id: "primary-aligned",
          label: "Admit two minutes",
          description: "You say you only started it and promise to finish and give real feedback.",
          actionTags: ["ethical", "honesty"],
          beliefImpact: { honesty: 0.25 },
          strainDelta: -5,
          tone: "aligned"
        }
      ],
      reductions: {
        behavior_change: {
          label: "Change Behaviour",
          explanation: "I can be honest and still be supportive if I follow through afterward.",
          actionTags: ["ethical", "honesty"],
          baseWeight: 1,
          beliefImpact: { honesty: +0.5 },
          strainDelta: -10,
          tone: "aligned"
        },
        belief_change: {
          label: "Adjust Belief",
          explanation: "Avoiding conflict is its own kind of honesty, because I’m protecting the relationship.",
          actionTags: ["ethical", "honesty"],
          baseWeight: 1,
          beliefImpact: { honesty: -0.25 },
          strainDelta: -5,
          tone: "mixed"
        },
        justification: {
          label: "Justify Behaviour",
          explanation: "A small lie is kinder than a truth that would hurt them right now.",
          actionTags: ["ethical", "honesty", "avoidance"],
          baseWeight: 1,
          beliefImpact: { honesty: -0.5 },
          strainDelta: -5,
          tone: "conflict"
        }
      }
    },
    {
      id: "diet-promise",
      episodeLabel: "Scenario 4",
      title: 'Diet Promise — "I Deserve This"',
      belief: '"I have strong self-control."',
      beliefId: "selfControl",
      situation:
        "You committed to cutting sugary snacks for a month, and you've been posting your progress publicly.",
      scenario:
        "You committed to cutting sugary snacks for a month, and you've been posting your progress publicly.",
      innerVoices: [
        'Self-Control: "You said no sugar this month."',
        'Comfort: "You had a rough day, just this once."',
        'Avoidance: "Don’t think about the challenge, just eat."',
        'Identity: "If you cave now, are you still disciplined?"'
      ],
      decision: "Cravings hit—what do you do next?",
      decisionAction: {
        actionTags: ["self-control", "diet"],
        beliefImpact: { selfControl: -0.5 },
        strainDelta: +10,
        tone: "conflict"
      },
      primaryChoices: [
        {
          id: "primary-conflict",
          label: "Eat the cake",
          description: "You take a bite to quiet the craving and deal with the plan tomorrow.",
          actionTags: ["self-control", "diet"],
          beliefImpact: { selfControl: -0.5 },
          strainDelta: +10,
          tone: "conflict"
        },
        {
          id: "primary-aligned",
          label: "Put cake back",
          description: "You close the fridge and walk away until the urge fades a little.",
          actionTags: ["self-control", "diet"],
          beliefImpact: { selfControl: 0.25 },
          strainDelta: -5,
          tone: "aligned"
        }
      ],
      reductions: {
        behavior_change: {
          label: "Change Behaviour",
          explanation: "If I pause and step away, the craving will pass and I’ll stay on track.",
          actionTags: ["self-control", "diet"],
          baseWeight: 1,
          beliefImpact: { selfControl: +0.5 },
          strainDelta: -10,
          tone: "aligned"
        },
        belief_change: {
          label: "Adjust Belief",
          explanation: "This doesn’t count—real self-control is about the major decisions, not one snack.",
          actionTags: ["self-control", "diet"],
          baseWeight: 1,
          beliefImpact: { selfControl: -0.25 },
          strainDelta: -5,
          tone: "mixed"
        },
        justification: {
          label: "Justify Behaviour",
          explanation: "I’ve earned this—stress means normal rules don’t apply tonight.",
          actionTags: ["self-control", "diet", "avoidance"],
          baseWeight: 1,
          beliefImpact: { selfControl: -0.5 },
          strainDelta: -5,
          tone: "conflict"
        }
      }
    },
    {
      id: "identity-clash",
      episodeLabel: "Scenario 5",
      title: 'Identity Clash — "Not That Kind of Person"',
      belief: '"I am open-minded and fair."',
      beliefId: "fairness",
      situation:
        "You see an online post mocking a group you publicly support, and your friends start joining in.",
      scenario:
        "You see an online post mocking a group you publicly support, and your friends start joining in.",
      innerVoices: [
        'Fairness: "This is unfair and one-sided."',
        'Comfort: "Just go along, don’t start drama."',
        'Avoidance: "If you speak up, you’ll be the killjoy."',
        'Identity: "Do you actually stand up for what you say you value?"'
      ],
      decision: "The group laughs at the post—what do you do next?",
      decisionAction: {
        actionTags: ["identity", "fairness"],
        beliefImpact: { fairness: -0.5 },
        strainDelta: +10,
        tone: "conflict"
      },
      primaryChoices: [
        {
          id: "primary-conflict",
          label: "Send a laugh emoji",
          description: "You react like everyone else so you don’t stand out in the thread.",
          actionTags: ["identity", "fairness"],
          beliefImpact: { fairness: -0.5 },
          strainDelta: +10,
          tone: "conflict"
        },
        {
          id: "primary-aligned",
          label: "Say that’s unfair",
          description: "You type one line that the pile-on feels mean and one-sided.",
          actionTags: ["identity", "fairness"],
          beliefImpact: { fairness: 0.25 },
          strainDelta: -5,
          tone: "aligned"
        }
      ],
      reductions: {
        behavior_change: {
          label: "Change Behaviour",
          explanation: "If I say something now, I’ll be acting like the fair person I claim to be.",
          actionTags: ["identity", "fairness"],
          baseWeight: 1,
          beliefImpact: { fairness: +0.5 },
          strainDelta: -10,
          tone: "aligned"
        },
        belief_change: {
          label: "Adjust Belief",
          explanation: "Maybe being open-minded means letting people joke without policing them.",
          actionTags: ["identity", "fairness"],
          baseWeight: 1,
          beliefImpact: { fairness: -0.25 },
          strainDelta: -5,
          tone: "mixed"
        },
        justification: {
          label: "Justify Behaviour",
          explanation: "It’s not my job to fight every battle—this is just how the group talks.",
          actionTags: ["identity", "fairness", "avoidance"],
          baseWeight: 1,
          beliefImpact: { fairness: -0.5 },
          strainDelta: -5,
          tone: "conflict"
        }
      }
    },
    {
      id: "intimate-relationship",
      episodeLabel: "Scenario 6",
      title: "Intimate Relationship — “It Wasn’t That Serious”",
      belief: '"Love should feel safe." / "I will not allow myself to live in fear."',
      beliefId: "safetyInLove",
      beliefFocusLabel: "Safety in love",
      situation:
        "You have been married for five years and have a six-year-old child. To others, your partner seems attentive and responsible—at gatherings he shields you from drinking, and relatives call him family-oriented. At home, his moods have grown unstable. One evening, when dinner is not to his taste, he slams his chopsticks down and says in a low, angry voice, “You can’t even get this right?” Your child goes quiet. You feel afraid—not because you were hit, but because of the heavy pressure in his presence. The next day he buys breakfast and says work has been stressful. Your mother tells you, “Men have tempers. Don’t break the family apart—the child is what matters.” You still believe love should feel safe and that you will not live in fear—yet you do not leave.",
      scenario:
        "You have been married for five years and have a six-year-old child. To others, your partner seems attentive and responsible—at gatherings he shields you from drinking, and relatives call him family-oriented. At home, his moods have grown unstable. One evening, when dinner is not to his taste, he slams his chopsticks down and says in a low, angry voice, “You can’t even get this right?” Your child goes quiet. You feel afraid—not because you were hit, but because of the heavy pressure in his presence. The next day he buys breakfast and says work has been stressful. Your mother tells you, “Men have tempers. Don’t break the family apart—the child is what matters.” You still believe love should feel safe and that you will not live in fear—yet you do not leave.",
      innerVoices: [
        'Honesty: “You were truly afraid. Your body froze.”',
        'Security: “You have a child. Reality matters more than principles.”',
        'Social pressure: “Everyone thinks he’s good. Are you too sensitive?”',
        'Attachment: “He apologized. He didn’t mean it.”'
      ],
      decision:
        "Weeks later, during another argument, he grabs your wrist harder than before. Your child hears the commotion. What do you do next?",
      decisionAction: {
        actionTags: ["intimate-relationship", "safety-in-love"],
        beliefImpact: { safetyInLove: -0.5 },
        strainDelta: +10,
        tone: "conflict"
      },
      primaryChoices: [
        {
          id: "primary-conflict",
          label: "Stay & minimize",
          description: "Smooth things over and downplay the wrist incident to keep the appearance of “everything’s fine.”",
          actionTags: ["intimate-relationship", "safety-in-love"],
          beliefImpact: { safetyInLove: -0.5 },
          strainDelta: +10,
          tone: "conflict"
        },
        {
          id: "primary-aligned",
          label: "Seek help & set boundaries",
          description: "Leave temporarily or seek support, and state a clear safety boundary immediately.",
          actionTags: ["intimate-relationship", "safety-in-love"],
          beliefImpact: { safetyInLove: 0.25 },
          strainDelta: -5,
          tone: "aligned"
        }
      ],
      reductions: {
        behavior_change: {
          label: "Action change",
          explanation:
            "You seek help, leave temporarily, or set firm boundaries—so your life matches the belief that love should not feel frightening.",
          actionTags: ["intimate-relationship", "safety-in-love"],
          baseWeight: 1,
          beliefImpact: { safetyInLove: +0.5 },
          strainDelta: -15,
          tone: "aligned"
        },
        belief_change: {
          label: "Belief change",
          explanation:
            "You narrow your standard: “As long as he doesn’t really hit me, it’s not abuse,” redefining harm so staying feels consistent.",
          actionTags: ["intimate-relationship", "safety-in-love"],
          baseWeight: 1,
          beliefImpact: { safetyInLove: -0.25 },
          strainDelta: -5,
          tone: "mixed"
        },
        justification: {
          label: "Justification",
          explanation:
            "You tell yourself it was your tone, he’s just stressed, or he can be gentle too—classifying fear as a one-off, not a pattern.",
          actionTags: ["intimate-relationship", "safety-in-love", "avoidance"],
          baseWeight: 1,
          beliefImpact: { safetyInLove: -0.25 },
          strainDelta: -5,
          tone: "mixed"
        }
      },
      systemFeedback: {
        behavior_change: {
          dissonance: "Tension drops sharply: action realigns with safety.",
          beliefStrength: "“Love should feel safe” strengthens when behavior backs it up.",
          longTerm: "Clear limits make it easier to recognize the line if it happens again."
        },
        belief_change: {
          dissonance: "Tension eases because you shrink what counts as unacceptable harm.",
          beliefStrength: "Safety-in-love weakens as your threshold moves.",
          longTerm: "Similar incidents may trigger less inner resistance over time."
        },
        justification: {
          dissonance: "Tension dips for now but often returns when something similar happens.",
          beliefStrength: "You may still endorse safety in words while it feels shakier inside.",
          longTerm: "Repeated justification can dull sensitivity to your own discomfort."
        }
      },
      reflectionPrompts: [
        "Did you redefine harm to protect the relationship?",
        "When did fear first start to feel “normal”?",
        "Are you staying because it feels safe—or because leaving feels costly?",
        "If a friend described this situation, would you interpret it the same way?"
      ]
    },
    {
      id: "intimate-relationship-phone",
      episodeLabel: "Scenario 7",
      title: 'Intimate Relationship — "Just Show Me"',
      belief: '"Love should feel safe." / "I will not allow myself to live in fear."',
      beliefId: "safetyInLove",
      beliefFocusLabel: "Safety in love",
      situation:
        "Your partner has been tense lately. After you laugh at a text from a coworker, they go quiet, then say they need to “see for yourself” that nothing is going on. Your parents think jealousy means someone cares. You value privacy—but you also hate the cold silence that follows when you say no.",
      scenario:
        "Your partner has been tense lately. After you laugh at a text from a coworker, they go quiet, then say they need to “see for yourself” that nothing is going on. Your parents think jealousy means someone cares. You value privacy—but you also hate the cold silence that follows when you say no.",
      innerVoices: [
        'Honesty: “This isn’t about trust—it’s about control.”',
        'Security: “If I refuse, tonight will be unbearable.”',
        'Social pressure: “People will say I must be hiding something if I don’t share.”',
        'Attachment: “Maybe if I prove there’s nothing, the suspicion will finally stop.”'
      ],
      decision: "Your partner asks to see your phone—what do you do next?",
      decisionAction: {
        actionTags: ["intimate-relationship", "safety-in-love"],
        beliefImpact: { safetyInLove: -0.5 },
        strainDelta: +10,
        tone: "conflict"
      },
      primaryChoices: [
        {
          id: "primary-conflict",
          label: "Hand over phone",
          description: "You unlock it and pass it to them so the tension in the room drops tonight.",
          actionTags: ["intimate-relationship", "safety-in-love"],
          beliefImpact: { safetyInLove: -0.5 },
          strainDelta: +10,
          tone: "conflict"
        },
        {
          id: "primary-aligned",
          label: "Keep it private",
          description: "You say your phone is yours and offer calm words instead of full access.",
          actionTags: ["intimate-relationship", "safety-in-love"],
          beliefImpact: { safetyInLove: 0.25 },
          strainDelta: -5,
          tone: "aligned"
        }
      ],
      reductions: {
        behavior_change: {
          label: "Action change",
          explanation:
            "You name the boundary: your phone is private; you offer reassurance without surrendering access—because safety includes your autonomy.",
          actionTags: ["intimate-relationship", "safety-in-love"],
          baseWeight: 1,
          beliefImpact: { safetyInLove: +0.5 },
          strainDelta: -15,
          tone: "aligned"
        },
        belief_change: {
          label: "Belief change",
          explanation:
            "You tell yourself that real intimacy means no secrets—so giving access feels like love, not fear.",
          actionTags: ["intimate-relationship", "safety-in-love"],
          baseWeight: 1,
          beliefImpact: { safetyInLove: -0.25 },
          strainDelta: -5,
          tone: "mixed"
        },
        justification: {
          label: "Justification",
          explanation:
            "You decide it’s easier to comply than to fight; you call it “not a big deal” so you don’t have to feel what it costs you.",
          actionTags: ["intimate-relationship", "safety-in-love", "avoidance"],
          baseWeight: 1,
          beliefImpact: { safetyInLove: -0.25 },
          strainDelta: -5,
          tone: "mixed"
        }
      },
      systemFeedback: {
        behavior_change: {
          dissonance: "Tension drops: you act as if your safety and dignity matter.",
          beliefStrength: "Safety-in-love strengthens when limits are real, not only wished for.",
          longTerm: "Boundaries you keep become easier to repeat."
        },
        belief_change: {
          dissonance: "Tension eases by redefining privacy as optional in love.",
          beliefStrength: "The belief in emotional safety softens to fit surveillance.",
          longTerm: "Each concession can make the next one feel smaller."
        },
        justification: {
          dissonance: "Short-term relief; unease often returns when the pattern repeats.",
          beliefStrength: "You may still say “safe” while feeling less sure inside.",
          longTerm: "Habitual minimizing dulls how loud your discomfort feels."
        }
      },
      reflectionPrompts: [
        "Would you ask a friend to hand over their phone to prove loyalty?",
        "When did ‘peace’ start to mean ‘give in’?",
        "Does this choice protect the relationship—or only the story you tell about it?"
      ]
    },
    {
      id: "intimate-relationship-money",
      episodeLabel: "Scenario 8",
      title: 'Intimate Relationship — "We\'re Saving"',
      belief: '"Love should feel safe." / "I will not allow myself to live in fear."',
      beliefId: "safetyInLove",
      beliefFocusLabel: "Safety in love",
      situation:
        "You share finances for the mortgage and childcare. Your partner reviews every purchase and sighs when you spend on yourself, even small things. Relatives praise how “responsible” you look as a couple. You told yourself love shouldn’t feel like walking a tightrope—but you’ve started hiding receipts.",
      scenario:
        "You share finances for the mortgage and childcare. Your partner reviews every purchase and sighs when you spend on yourself, even small things. Relatives praise how “responsible” you look as a couple. You told yourself love shouldn’t feel like walking a tightrope—but you’ve started hiding receipts.",
      innerVoices: [
        'Honesty: “I’m tiptoeing around my own money.”',
        'Security: “If I push back, we’ll fight about the bills again.”',
        'Social pressure: “Everyone says joint accounts mean transparency.”',
        'Attachment: “They’re stressed—we’re a team. I can be flexible.”'
      ],
      decision: "Money turns into a fight—what do you do next?",
      decisionAction: {
        actionTags: ["intimate-relationship", "safety-in-love"],
        beliefImpact: { safetyInLove: -0.5 },
        strainDelta: +10,
        tone: "conflict"
      },
      primaryChoices: [
        {
          id: "primary-conflict",
          label: "Round price down",
          description: "You shave the number so they stop questioning and the fight stops sooner.",
          actionTags: ["intimate-relationship", "safety-in-love"],
          beliefImpact: { safetyInLove: -0.5 },
          strainDelta: +10,
          tone: "conflict"
        },
        {
          id: "primary-aligned",
          label: "Propose shared rules",
          description: "You ask to write simple spending rules you both agree on before anyone audits the other.",
          actionTags: ["intimate-relationship", "safety-in-love"],
          beliefImpact: { safetyInLove: 0.25 },
          strainDelta: -5,
          tone: "aligned"
        }
      ],
      reductions: {
        behavior_change: {
          label: "Action change",
          explanation:
            "You propose a clear, fair budget you both agree on—and keep a private essentials line—so control doesn’t masquerade as care.",
          actionTags: ["intimate-relationship", "safety-in-love"],
          baseWeight: 1,
          beliefImpact: { safetyInLove: +0.5 },
          strainDelta: -15,
          tone: "aligned"
        },
        belief_change: {
          label: "Belief change",
          explanation:
            "You decide that in a serious relationship, oversight is normal—so discomfort with scrutiny means you’re “not mature enough yet.”",
          actionTags: ["intimate-relationship", "safety-in-love"],
          baseWeight: 1,
          beliefImpact: { safetyInLove: -0.251 },
          strainDelta: -5,
          tone: "mixed"
        },
        justification: {
          label: "Justification",
          explanation:
            "You tell yourself the lie protected the peace and that you’ll “make it up” later—framing fear as temporary stress, not a pattern.",
          actionTags: ["intimate-relationship", "safety-in-love", "avoidance"],
          baseWeight: 1,
          beliefImpact: { safetyInLove: -0.25 },
          strainDelta: -5,
          tone: "mixed"
        }
      },
      systemFeedback: {
        behavior_change: {
          dissonance: "Tension drops when money rules are mutual, not one-sided.",
          beliefStrength: "Safety feels closer when you can speak without hiding.",
          longTerm: "Shared clarity beats hidden shortcuts."
        },
        belief_change: {
          dissonance: "Tension eases by shrinking what you call “controlling.”",
          beliefStrength: "Safety-in-love bends to fit monitoring.",
          longTerm: "The bar for “acceptable” can keep moving."
        },
        justification: {
          dissonance: "Brief relief; shame or resentment may resurface quietly.",
          beliefStrength: "Words stay noble; trust in yourself may thin.",
          longTerm: "Secrets become their own kind of strain."
        }
      },
      reflectionPrompts: [
        "Would you be okay if your partner hid spending the way you did?",
        "Is ‘teamwork’ mutual—or mostly your compliance?",
        "What would fairness look like on paper, not just in tone?"
      ]
    },
    {
      id: "intimate-relationship-isolation",
      episodeLabel: "Scenario 9",
      title: 'Intimate Relationship — "They Don\'t Get Us"',
      belief: '"Love should feel safe." / "I will not allow myself to live in fear."',
      beliefId: "safetyInLove",
      beliefFocusLabel: "Safety in love",
      situation:
        "Your best friend has noticed you cancel plans more often. Your partner says your friend is “a bad influence” and picks at small things they said. At family dinner, your cousin jokes that you’ve disappeared. You miss your friend—but going home tense feels worse than staying in.",
      scenario:
        "Your best friend has noticed you cancel plans more often. Your partner says your friend is “a bad influence” and picks at small things they said. At family dinner, your cousin jokes that you’ve disappeared. You miss your friend—but going home tense feels worse than staying in.",
      innerVoices: [
        'Honesty: “I’m losing people who actually see me.”',
        'Security: “If I defend my friend, I’ll pay for it later.”',
        'Social pressure: “Couples are supposed to prioritize each other first.”',
        'Attachment: “Maybe my friend doesn’t understand how hard this job is on us.”'
      ],
      decision: "Your partner criticizes your friend—what do you do next?",
      decisionAction: {
        actionTags: ["intimate-relationship", "safety-in-love"],
        beliefImpact: { safetyInLove: -0.5 },
        strainDelta: +10,
        tone: "conflict"
      },
      primaryChoices: [
        {
          id: "primary-conflict",
          label: "Ghost your friend",
          description: "You cancel plans and go quiet so your partner stops bringing them up.",
          actionTags: ["intimate-relationship", "safety-in-love"],
          beliefImpact: { safetyInLove: -0.5 },
          strainDelta: +10,
          tone: "conflict"
        },
        {
          id: "primary-aligned",
          label: "Keep the friendship",
          description: "You still meet your friend sometimes and don’t cut them off over this.",
          actionTags: ["intimate-relationship", "safety-in-love"],
          beliefImpact: { safetyInLove: 0.25 },
          strainDelta: -5,
          tone: "aligned"
        }
      ],
      reductions: {
        behavior_change: {
          label: "Action change",
          explanation:
            "You keep one steady connection outside the relationship—because isolation isn’t the price of love.",
          actionTags: ["intimate-relationship", "safety-in-love"],
          baseWeight: 1,
          beliefImpact: { safetyInLove: +0.5 },
          strainDelta: -15,
          tone: "aligned"
        },
        belief_change: {
          label: "Belief change",
          explanation:
            "You decide that cutting ties proves loyalty—that a “real” partnership means your circle shrinks.",
          actionTags: ["intimate-relationship", "safety-in-love"],
          baseWeight: 1,
          beliefImpact: { safetyInLove: -0.25 },
          strainDelta: -5,
          tone: "mixed"
        },
        justification: {
          label: "Justification",
          explanation:
            "You tell yourself the friendship was draining anyway—reframing loss as maturity, not fear.",
          actionTags: ["intimate-relationship", "safety-in-love", "avoidance"],
          baseWeight: 1,
          beliefImpact: { safetyInLove: -0.25 },
          strainDelta: -5,
          tone: "mixed"
        }
      },
      systemFeedback: {
        behavior_change: {
          dissonance: "Tension falls when you reclaim outside support.",
          beliefStrength: "Safety includes not being alone with the hard nights.",
          longTerm: "One trusted witness changes what you can tolerate."
        },
        belief_change: {
          dissonance: "Tension eases by romanticizing shrinking your world.",
          beliefStrength: "Safety-in-love weakens as isolation feels like proof of love.",
          longTerm: "Fewer allies can mean fewer exits—emotionally, not only physically."
        },
        justification: {
          dissonance: "Short-term relief; grief may hit later in quieter moments.",
          beliefStrength: "You may sound sure while mourning underneath.",
          longTerm: "Ghosting friends can become a habit when conflict looms."
        }
      },
      reflectionPrompts: [
        "Who benefits if your support network gets smaller?",
        "When did loyalty start to mean disappearing?",
        "If your friend wrote this story about you, what would you tell them?"
      ]
    },
    {
      id: "intimate-relationship-apology",
      episodeLabel: "Scenario 10",
      title: 'Intimate Relationship — "They Brought Flowers"',
      belief: '"Love should feel safe." / "I will not allow myself to live in fear."',
      beliefId: "safetyInLove",
      beliefFocusLabel: "Safety in love",
      situation:
        "After a harsh night—raised voice, slammed door—you said you needed space to think. The next morning there are flowers, breakfast, and promises that it won’t happen again. Your sibling texts, “See? They’re trying.” Part of you still flinches when they move too fast—but you hate being the one who “holds a grudge.”",
      scenario:
        "After a harsh night—raised voice, slammed door—you said you needed space to think. The next morning there are flowers, breakfast, and promises that it won’t happen again. Your sibling texts, “See? They’re trying.” Part of you still flinches when they move too fast—but you hate being the one who “holds a grudge.”",
      innerVoices: [
        'Honesty: “Gifts don’t erase what my nervous system remembers.”',
        'Security: “If I stay cold, this could blow up again.”',
        'Social pressure: “Everyone expects me to forgive and move on.”',
        'Attachment: “The gentle version of them is the real one—last night was the stress.”'
      ],
      decision: "After the apology, what do you do next?",
      decisionAction: {
        actionTags: ["intimate-relationship", "safety-in-love"],
        beliefImpact: { safetyInLove: -0.5 },
        strainDelta: +10,
        tone: "conflict"
      },
      primaryChoices: [
        {
          id: "primary-conflict",
          label: "Move on fast",
          description: "You hug them back and drop what you were going to ask for so the day feels normal.",
          actionTags: ["intimate-relationship", "safety-in-love"],
          beliefImpact: { safetyInLove: -0.5 },
          strainDelta: +10,
          tone: "conflict"
        },
        {
          id: "primary-aligned",
          label: "Name one change",
          description: "You thank them and still say what you need different next time, calmly.",
          actionTags: ["intimate-relationship", "safety-in-love"],
          beliefImpact: { safetyInLove: 0.25 },
          strainDelta: -5,
          tone: "aligned"
        }
      ],
      reductions: {
        behavior_change: {
          label: "Action change",
          explanation:
            "You thank them—and still name one concrete change you need next time, because repair without pattern change isn’t safety.",
          actionTags: ["intimate-relationship", "safety-in-love"],
          baseWeight: 1,
          beliefImpact: { safetyInLove: +0.5 },
          strainDelta: -15,
          tone: "aligned"
        },
        belief_change: {
          label: "Belief change",
          explanation:
            "You redefine love as forgiveness above all—so fear after a blow-up becomes “lack of faith,” not information.",
          actionTags: ["intimate-relationship", "safety-in-love"],
          baseWeight: 1,
          beliefImpact: { safetyInLove: -0.25 },
          strainDelta: -5,
          tone: "mixed"
        },
        justification: {
          label: "Justification",
          explanation:
            "You tell yourself you’re oversensitive and that good partners don’t keep score—turning your caution into self-blame.",
          actionTags: ["intimate-relationship", "safety-in-love", "avoidance"],
          baseWeight: 1,
          beliefImpact: { safetyInLove: -0.25 },
          strainDelta: -5,
          tone: "mixed"
        }
      },
      systemFeedback: {
        behavior_change: {
          dissonance: "Tension drops when repair includes behavior, not only charm.",
          beliefStrength: "Safety-in-love grows when words match limits.",
          longTerm: "Patterns become visible when you don’t reset too fast."
        },
        belief_change: {
          dissonance: "Tension eases by elevating forgiveness over fear signals.",
          beliefStrength: "The belief warps: ‘safe’ starts to mean ‘silent.’",
          longTerm: "Cycles can shorten: blow-up, gift, reset—repeat."
        },
        justification: {
          dissonance: "Relief now; doubt may return in smaller, quieter ways.",
          beliefStrength: "You may sound convinced while bracing inside.",
          longTerm: "Self-blame can train you to doubt your own alarms."
        }
      },
      reflectionPrompts: [
        "Does this apology change what happens next time—or only how you feel today?",
        "Who taught you that boundaries mean you’re unloving?",
        "What would ‘trying’ look like if it weren’t flowers?"
      ]
    }
  ];

  window.SCENARIOS = scenarios;
})();

