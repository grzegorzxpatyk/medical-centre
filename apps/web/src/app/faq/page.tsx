import type { Metadata } from 'next'

import { PageShell } from '@/components/page-shell'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Odpowiedzi na najczęściej zadawane pytania.',
}

const faq = [
  {
    question: 'Jak umówić się na wizytę?',
    answer: `Wizytę umówisz telefonicznie pod numerem ${siteConfig.phone} w godzinach ${siteConfig.openingHours} lub przez e-Rejestrację.`,
  },
  {
    question: 'Czy muszę złożyć deklarację POZ?',
    answer:
      'Aby korzystać z bezpłatnej opieki lekarza podstawowej opieki zdrowotnej, należy złożyć deklarację wyboru. Można to zrobić na miejscu w rejestracji.',
  },
  {
    question: 'Jak odebrać wyniki badań?',
    answer:
      'Wyniki badań odbierzesz osobiście w rejestracji za okazaniem dokumentu tożsamości. Dostęp online jest w przygotowaniu.',
  },
  {
    question: 'Czy przyjmujecie dzieci?',
    answer:
      'Tak, prowadzimy poradnię pediatryczną obejmującą opiekę nad dziećmi od pierwszych dni życia.',
  },
]

export default function FaqPage() {
  return (
    <PageShell title="FAQ" lead="Odpowiedzi na najczęściej zadawane pytania.">
      <Accordion className="max-w-3xl">
        {faq.map((entry) => (
          <AccordionItem key={entry.question} value={entry.question}>
            <AccordionTrigger>{entry.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{entry.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </PageShell>
  )
}
