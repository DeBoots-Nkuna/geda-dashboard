export const metadata = {
  title: 'Privacy Policy — GedA Dashboard',
  description: 'How we handle your information.',
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight text-customNavyTeal">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Last updated: Month, Date Year
      </p>

      <section className="prose prose-slate mt-6 max-w-none">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
          posuere, magna sed sagittis rhoncus, nibh arcu viverra mi, id
          ullamcorper purus arcu id dui. Donec gravida, nibh id consectetur
          tempor, lorem quam euismod leo, vitae vulputate sapien lorem sed
          velit.
        </p>

        <h2 className="text-xl text-customNavyTeal">Information We Collect</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
          tincidunt, odio id tempor viverra, diam arcu pulvinar tortor, a
          posuere justo urna eget magna. Curabitur luctus, ipsum ut iaculis
          dictum, lectus mi dignissim ex, a blandit lectus lorem ac arcu.
        </p>
        <ul>
          <li>Contact details (e.g., name, email) provided by you.</li>
          <li>Content you upload (e.g., documents, metadata).</li>
          <li>Usage data such as pages viewed and actions taken.</li>
        </ul>

        <h2 className="text-xl text-customNavyTeal">How We Use Information</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
          tristique sem ut augue tristique, in dignissim felis blandit. Sed
          consequat, enim sit amet mattis laoreet, ligula metus elementum sem,
          at varius lorem ligula id velit.
        </p>
        <ul>
          <li>To operate and improve the dashboard and related services.</li>
          <li>To provide support and respond to inquiries.</li>
          <li>To maintain security, monitor performance, and prevent abuse.</li>
        </ul>

        <h2 className="text-xl text-customNavyTeal">Sharing & Disclosure</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
          volutpat, nibh at pulvinar aliquet, orci magna pharetra est, eu
          convallis tortor odio at arcu. Data may be shared with service
          providers that help us run the platform, subject to appropriate
          confidentiality obligations. We may disclose information if required
          by law or to protect our rights.
        </p>

        <h2 className="text-xl text-customNavyTeal">Data Retention</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit
          amet iaculis magna. We retain information for as long as necessary to
          provide the service, comply with legal obligations, or resolve
          disputes.
        </p>

        <h2 className="text-xl text-customNavyTeal">Security</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
          et felis ut velit ullamcorper fermentum. No method of transmission or
          storage is 100% secure; we work to protect your information but cannot
          guarantee absolute security.
        </p>

        <h2 className="text-xl text-customNavyTeal">Your Rights</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. You may
          request access, correction, or deletion of your personal information
          subject to applicable law. Contact us using the details below.
        </p>

        <h2 className="text-xl text-customNavyTeal">International Transfers</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Data may be
          processed in jurisdictions that may not offer the same level of
          protection as your home country. We take steps to safeguard transfers
          in accordance with applicable law.
        </p>

        <h2 className="text-xl text-customNavyTeal">Children’s Privacy</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. The service
          is not directed to children under the age where parental consent is
          required, and we do not knowingly collect such data.
        </p>

        <h2 className="text-xl text-customNavyTeal">Changes to This Policy</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. We may update
          this Policy from time to time. Material changes will be indicated by
          updating the “Last updated” date above.
        </p>

        <h2 className="text-xl text-customNavyTeal">Contact</h2>
        <p>
          Questions? Email{' '}
          <a href="mailto:support@example.com">support@example.com</a>.
        </p>
      </section>
    </div>
  )
}
