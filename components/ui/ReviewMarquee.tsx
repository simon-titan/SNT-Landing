"use client";
import React, { useState } from "react";
import { Box, Text, HStack, VStack } from "@chakra-ui/react";
// Ersetze den Import von StarIcon
// import { StarIcon } from "@chakra-ui/icons";

const StarIcon = ({ filled = false }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 20 20"
    fill={filled ? "#3182CE" : "#E2E8F0"}
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: "inline-block", verticalAlign: "middle" }}
  >
    <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
  </svg>
);

// Halber Stern als SVG
const StarIconHalf = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: "inline-block", verticalAlign: "middle" }}
  >
    <defs>
      <linearGradient id="half-blue">
        <stop offset="50%" stopColor="#3182CE" />
        <stop offset="50%" stopColor="#E2E8F0" />
      </linearGradient>
    </defs>
    <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" fill="url(#half-blue)" />
  </svg>
);

const reviews = [
  {
    text: "Ich bin absolut begeistert von SNTTrades! Das Mentorship ist unglaublich! Man lernt hier nicht nur theoretisch, sondern erhält auch praxisnahen Support, der einem wirklich weiterhilft. Besonders beeindruckend sind die Live Trading Sessions mit den Mentoren, bei denen man in Echtzeit von deren Erfahrung profitieren kann. Auch die Mindset-Calls mit den Mentoren sind der Hammer, sie geben mir stets den nötigen Antrieb und helfen mir, den richtigen Fokus zu behalten. Der Austausch mit anderen Mitgliedern und erfahrenen Tradern ist äußerst bereichernd. Die Mentoren stehen mit Rat und Tat zur Seite, motivieren dazu, auch in schwierigen Phasen nicht aufzugeben, und sind immer hilfsbereit. Nachdem ich zuvor mehrere teure Trading-Kurse absolviert hatte, die letztlich nur leere Versprechen waren, war es eine echte Offenbarung, SNTTrades zufällig zu entdecken. Hier bekommt man endlich das, was versprochen wird: fundiertes Wissen, echte Unterstützung und eine Community, die zusammenhält. Für mich war es die beste Entscheidung meines Lebens – wer auf der Suche nach authentischem Trading-Wissen und nachhaltiger Mentorship ist, sollte hier unbedingt vorbeischauen! SNTTrades hat meine Sicht auf Trading komplett verändert und mir gezeigt, dass man mit der richtigen Unterstützung wirklich erfolgreich sein kann. Ich kann es jedem nur wärmstens empfehlen!",
    name: "SUAD",
    date: "12.03.2025",
    rating: 5,
  },
  {
    text: "Einzig wahre Entscheidung! Es sind so viele Scammer da draußen aber die beiden Jungs sind nicht nur extrem fair, sondern auch noch sehr gut in dem was sie machen. Ich habe sehr viel gelernt und lerne immer noch. Danke für alles was ihr macht und für die mega Community. Werde demnächst meine Challenge gepasst haben. Kann es jedem nur empfehlen der ernsthaft durchziehen will und sein Lebensunterhalt mit Trading verdienen will. Ihr seid hier genau richtig. In diesem Sinne: Happy Profits!",
    name: "Gayret",
    date: "19.03.2025",
    rating: 5,
  },
  {
    text: "Beste Entscheidung – 1:1 Coaching auf einem neuen Level! Ich hatte ein 1:1 Coaching und kann nur sagen: absolut top! Endlich mal jemand, der Trading locker, verständlich und auf den Punkt erklärt. Kein unnötiges Fachgelaber, sondern direkt umsetzbare Strategien. Ich habe wirklich viel gelernt!",
    name: "Thomas Brandt",
    date: "15.03.2025",
    rating: 5,
  },
  {
    text: "Ihr versteht nicht, diese Brühs haben für so wenig Geld soviel Mehrwert gegeben und sind mir sehr ans Herz gewachsen. SNT ist schon quasi eine Familie. Wenn ihr überlegt, für diesen Preis einen Mehrwert von mehreren tausenden von Euros zu bekommen + diese krasse Community zu haben und ihr dann überlegt es nicht zu kaufen weil es zu 'Teuer' ist, dann kann man euch nicht mehr helfen. Ali und Emre danke für alles ❤️",
    name: "Alessio",
    date: "10.03.2025",
    rating: 5,
  },
  {
    text: "Durch Ali und Emre hat sich mein Tradingskill und die Psyche enorm weiterentwickelt, ich konnte innerhalb 1 Jahr mein ersten Payout erreichen und war multiple Funded. Beste Entscheidung für den Preis, gibt es nichts besseres!",
    name: "Nabil",
    date: "10.03.2025",
    rating: 5,
  },
  {
    text: "Die Zusammenarbeit im Rahmen des Coachings war eine äußerst bereichernde Erfahrung. Durch das Coaching wurde eine unglaublich positive und motivierende Atmosphäre geschaffen, die sowohl fachlich als auch persönlich zum Wachstum anregte. Mit klaren, präzisen Ratschlägen und einer einfühlsamen, unterstützenden Herangehensweise wurde ein Raum für Weiterentwicklung geschaffen. Komplexe Themen wurden verständlich vermittelt, und es wurden praxisorientierte Werkzeuge bereitgestellt, die sofort im Alltag umsetzbar waren. Besonders wertvoll war es, wie die eigenen Stärken erkannt und gezielt weiter ausgebaut wurden.",
    name: "Unbekannt",
    date: "März 2025",
    rating: 5,
  },
  {
    text: "Meine Reise mit SNT – Ein echtes Level-Up! Ich bin jetzt seit fast einem Jahr Teil der Community – und wenn ich heute zurückblicke, ist es einfach crazy, welche Level-Ups ich in dieser Zeit gemacht habe. Seit NEFS draußen ist, geht es bei mir richtig voran – viel, viel weiter als je zuvor. Und das Krasseste: Ich habe gerade meine erste Challenge in nur 11 Handelstagen bestanden! Danke an Emre & Ali, dass ihr dieses Mentorship gestartet habt. SNT hat mein Leben verändert & es wird noch krasser, das ist erst der Anfang und ich kann es jedem empfehlen, der bereit ist, wirklich etwas zu verändern.",
    name: "Justin",
    date: "12.07.2025",
    rating: 5,
  },
  {
    text: "An @Ali D´ TRADING & @emre CEO: Als ich euch das erste Mal auf TikTok gesehen habe, wusste ich sofort – ihr seid echt. Keine, die einfach nur Kurse verkaufen wollen, sondern Menschen mit Herz, Vision und dem echten Wunsch, dass aus uns etwas wird. Ihr wollt nicht nur Wissen weitergeben – ihr wollt Leben verändern. Und genau das tut ihr. SNT AUF DIE EINS – und das bleibt so!",
    name: "Justin",
    date: "12.07.2025",
    rating: 5,
  },
  {
    text: "Hey Leute, ich bin vor knapp 5 Wochen gejoined. Ich trade seit über einem Jahr und habe glaube ich alle Phasen durchlaufen die man als Trader durchläuft. Try and error. Strategy hopping, dicke Verlustphasen usw. Seit einigen Monaten trade ich mit einem ordentlichen System und Risk Management. Ich konnte dadurch 13 APEX Evals bestehen, aber so richtig stabil profitabel war ich bisher nicht. Ich bin dann auf SNT gestoßen und dachte ich versuch's einfach mal und wurde nicht enttäuscht. NEFS funktioniert immer und nicht wie in anderen Strategien wo man nur den New York Open für 1-2 Stunden traden kann. Ich bin noch lange nicht am Ende der Reise aber ich kann wirklich nur jedem empfehlen der mit Trading anfängt mit SNT zu starten und NEFS zu traden. Danke an euch Jungs, macht bitte weiter so!🫡",
    name: "Marvin",
    date: "13.06.2025",
    rating: 5,
  },
  {
    text: "Hallo, ich bin Dominik und wahrscheinlich die deutscheste Kartoffel, die ihr je kennenlernen werdet. Ich habe Anfang Februar mit dem Trading angefangen, und was soll ich sagen: Ich war wahrscheinlich genau der Typ, den keiner mochte. Wenn ich früher auf Social Media irgendwas über Trading gesehen habe, dachte ich mir jedes Mal nur: 'Das ist doch Scam. Was redet der da? Und warum nervt der mich mit seinen Videos?' – Darauf bin ich im Nachhinein nicht besonders stolz. Bis ein Kumpel mal zu mir meinte: 'Digga Dominik, wie willst du dir eigentlich eine Meinung bilden, wenn du es selbst nie ausprobiert hast?' Und ich musste ihm recht geben. Das ist etwas, was jeder halbwegs gebildete Mensch eigentlich verstehen sollte.",
    name: "Dominik",
    date: "Juni 2025",
    rating: 5,
  },
  {
    text: "Yo yo was geht ab Leute, Erstmal zu mir, ich bin der Luciano trade schon länger jetzt mit dem Volume Profile und andere orderflow tools. Bin ganz frisch hier, aber folge die Jungs schon länger auf insta und hab ab und an Mal mit @emre CEO auf insta geschrieben. Nutze nefs jetzt selber auch es ist eine Bomben scalp Strategie die es in sich hat, ich gebe nur noch ein wenig von meiner eigenen Sauce mit rein. Ich kann euch versichern, ihr seid bei den Jungs hier gut aufgehoben. Es gibt viele Blender Fake Gurus da draussen die auch ihre PNLs etc fälschen und keinerlei Transparenz zeigen. Die Art wie @emre CEO und @Ali D´ TRADING Sachen erklären ist sehr gut und simple so dass es sogar ein 3 Klässler versteht ohne viel Schnickschnack und Drumherum Gelaber.",
    name: "Luciano",
    date: "Juli 2025",
    rating: 5,
  },
  {
    text: "Real Talk ---> 10/10 heißt, ganz klar nicht zu toppen!! Ich habe mir wirklich viel angeschaut was Trading Coachings angeht & deshalb glaubt mir, wenn ich euch sage, das ist ein anderes Level hier bei SNT als bei 95% der Anbieter 'vergleichbarer' Coachings... Das Preis-Leistungs-Verhältnis ist noch krasser bewertet 10/10+10 🙂 Gerade das 1zu1 Mentoring werdet ihr für das Geld sicher nirgends bekommen! Emre & Ali sind super korrekte Jungs und absolut gute Coaches! Wer sich das hier vermittelte Wissen aneignet und wirklich dran bleibt, kann nicht scheitern!",
    name: "Marcel",
    date: "Juli 2025",
    rating: 5,
  },
  {
    text: "Bestes Mentoring 🙏 Habe selten so einen gut aufgebauten Kurs gesehen und so lehrreiche Videos und dann noch das Livetrading was einfach das Beste ist. Meine bisherigen Erfahrungen waren mit Goldtradermo und der Kurs von fxalex (set and forget) welcher nebenbei 1500$ kostet und hier bekommt man den Kurs für knackige 240€ + die super Community.",
    name: "Marcel",
    date: "Juli 2025",
    rating: 5,
  },
  {
    text: "Aus meiner Erfahrung kann ich die SNT Community definitiv weiterempfehlen. Ich habe mir vorher vieles selbst beigebracht, aber am Ende lag es vor allem an meinen Emotionen und dem fehlenden roten Faden, was in fehlendem Vertrauen in einem selbst resultierte. Das wird aber sehr gut durch den Austausch mit Gleichgesinnten und die Lehrvideos von Emre und Ali gefestigt. Es tut gut, von profitablen Mentoren alles bündig erklärt zu bekommen, weil dann Verlass darauf ist. Emre und Ali verfolge ich auf Instagram schon seit langer Zeit, noch aus den Zeiten, in denen sie Masken getragen haben. Selbst dort bekommt man schon kleine Einblicke, und sie veröffentlichen einige Strategien oder Lehrmaterial. Das kommt aber natürlich nicht an das komplette Mentorship ran. Alles in allem: Top!",
    name: "Ali",
    date: "Juli 2025",
    rating: 5,
  },
  {
    text: "SNT ist das beste Mentorship egal ob für Anfänger oder schon erfahrene Trader. Nachdem ich jetzt Jahre in der deutschen Tradingbranche unterwegs bin und verschiedene Mentorships beigetreten bin um das Trading zu lernen, hat mich SNT immer wieder am meisten überzeugt. Wenn man sieht wie viel andere verlangen muss man wirklich ehrlich sein der Preis ist wirklich niedrig und der Value und was man hier lernt immens. Ali und Emre haben es mit ihrer sympathischen Art geschafft ein Coaching mit Liebe zum Detail auf die Beine zu stellen. Das Lernen und Verstehen, wie der Markt funktioniert ist hier wie ein Kinderspiel, da beide hervorragend erklären. Nun zur Community, man fühlt sich wohl und zudem wie eine Trading Familie. Die Leute sind offen und deine Fragen werden beantwortet, jeder ist für jeden da. Insgesamt ist es eine perfekte Opportunity für jeden den Trading interessiert, eine neue Welt für sich zu entdecken. Ich bin dankbar ein Teil von SNT zu sein.",
    name: "Ali",
    date: "Juli 2025",
    rating: 5,
  },
  {
    text: "Ich bin seit ein paar Wochen dabei, und die Informationen, die ich in dieser Zeit gesammelt habe, sind einfach unbezahlbar. Dazu kommt noch die Community, die man schon fast als Familie bezeichnen kann – jeder hilft jedem, und das ist einfach erstaunlich. Ein riesiges Dankeschön an meinen Mentor! Deine Geduld, dein Wissen und deine Fähigkeit, komplexe Themen verständlich zu erklären, haben mir in kürzester Zeit so viel gebracht. Nach nur etwa 14 intensiven Tagen konnte ich dank des Wissens von Ali und Emre selbstständig Analysen durchführen und erfolgreiche Trades setzen. Ihr gebt nicht nur Strategien an die Hand, sondern vermittelt eine Denkweise, die langfristig zum Erfolg führt. Man merkt sofort, dass ihr mit Leidenschaft dabei seid und wirklich wollt, dass jeder hier erfolgreich wird. Ich bin unendlich dankbar, Teil dieser großartigen Community zu sein, und freue mich auf alles, was noch kommt!",
    name: "Ahmad",
    date: "Juli 2025",
    rating: 5,
  },
];

const MAX_TEXT_LENGTH = 260;

const ReviewCard = ({ text, name, date, rating }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > MAX_TEXT_LENGTH;
  const displayText = expanded || !isLong ? text : text.slice(0, MAX_TEXT_LENGTH) + "...";

  return (
    <Box
      minW={{ base: "260px", md: "320px" }}
      maxW={{ base: "260px", md: "320px" }}
      minH={{ base: "320px", md: "340px" }}
      maxH={{ base: "320px", md: "340px" }}
      bg="white"
      borderRadius="lg"
      boxShadow="md"
      p={4}
      mx={2}
      flexShrink={0}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      pb={6}
      border="2px solid #3182CE"
      borderRadius="lg"
    >
      <HStack gap={1} mb={2} justify="flex-start">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i}><StarIcon filled={i < rating} /></span>
        ))}
      </HStack>
      <Box flexGrow={1} mb={2}>
        <Text fontSize="md" fontStyle="italic">
          "{displayText}"
          {isLong && !expanded && (
            <Box as="span" color="#3182CE" ml={1} cursor="pointer" onClick={() => setExpanded(true)}>
              Mehr lesen
            </Box>
          )}
        </Text>
      </Box>
      <Box>
        <Text fontWeight="bold">von {name}</Text>
        <Text fontSize="xs" color="gray.500">{date}</Text>
      </Box>
    </Box>
  );
};

export const ReviewMarquee = () => {
  // Dupliziere das Array für nahtlosen Loop
  const marqueeReviews = [...reviews, ...reviews];
  return (
    <Box
      w="100%"
      overflow="hidden"
      position="relative"
      py={{ base: 8, md: 12 }}
      bg="bg.subtle"
      _hover={{ cursor: "pointer" }}
    >
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: 200%;
          animation: marquee 40s linear infinite;
        }
        .marquee-paused {
          animation-play-state: paused !important;
        }
      `}</style>
      <VStack gap={4} align="center" w="full">
        <HStack gap={1} mb={1} justify="center" w="full">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i}><StarIcon filled={true} /></span>
          ))}
          <span><StarIconHalf /></span>
          <Text fontWeight="bold" fontSize="md" color="#3182CE" ml={2}>4,5 von 5</Text>
        </HStack>
        <Text fontWeight="bold" fontSize={{ base: "lg", md: "2xl" }} textAlign="center" w="full" textTransform="uppercase">
          WAS UNSERE TEILNEHMER SAGEN:<span role="img" aria-label="down"></span>
        </Text>
        <Box
          w="100%"
          minH={{ base: "180px", md: "210px" }}
          overflow="hidden"
          onMouseEnter={e => {
            const track = e.currentTarget.querySelector('.marquee-track');
            if (track) track.classList.add('marquee-paused');
          }}
          onMouseLeave={e => {
            const track = e.currentTarget.querySelector('.marquee-track');
            if (track) track.classList.remove('marquee-paused');
          }}
        >
          <Box className="marquee-track">
            {marqueeReviews.map((review, idx) => (
              <ReviewCard key={idx} {...review} />
            ))}
          </Box>
        </Box>
      </VStack>
    </Box>
  );
};

export default ReviewMarquee; 