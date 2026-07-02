# Sign-language visuals

Drop sign-language images here and they appear automatically on the matching
Communication card — no code changes needed.

## Convention

Name each file by the **phrase id** (see `data/phrases.ts`), placed in the
folder for its variant:

```
public/signs/fsl/<phraseId>.<ext>   ← Filipino Sign Language (PREFERRED)
public/signs/asl/<phraseId>.<ext>   ← American Sign Language (FALLBACK)
```

Supported extensions (checked in this order): `webp`, `png`, `jpg`, `gif`.
Animated GIFs work well for signs that involve motion.

## Resolution order (per phrase)

1. Explicit `fslVisualUrl` in the phrase data
2. Explicit `aslVisualUrl` in the phrase data
3. `signs/fsl/<phraseId>.*`  ← FSL is always tried before ASL
4. `signs/asl/<phraseId>.*`
5. "FSL visual coming soon" placeholder

A small badge on the image shows whether the displayed visual is **FSL** or
**ASL**, so users and interpreters always know which variant they're seeing.

## Phrase ids

```
i-am-deaf                 i-need-help              call-emergency-contact
please-write-it-down      need-medical-assistance  where-is-the-clinic
i-feel-dizzy              i-am-in-pain             need-barangay-certificate
where-should-i-go         tell-me-when-we-arrive   how-much-should-i-pay
please-wait               where-is-my-classroom    thank-you
yes                       no                       i-dont-understand
```

## Sourcing note

Use genuine FSL references (FSL dictionaries, your own recordings, or properly
licensed material). Do NOT use invented or incorrect handshapes — a wrong sign
misleads Deaf users. Respect copyright for any third-party imagery.
