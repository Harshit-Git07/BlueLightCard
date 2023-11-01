const verifyPageData = {
  infoCards: [
    {
      image: '/assets/verify/verify-illo-collect-data.svg',
      title: 'Collect valuable insights',
      content: () => (
        <>
          Each time a member shops with you, <span className="font-extrabold">Verify</span> allows
          you to understand where and when they are using your discount. These insights allow you to
          create specific member cohorts and target them directly to help you achieve your
          objectives.
        </>
      ),
    },
    {
      image: '/assets/verify/verify-illo-acquire.svg',
      title: 'Acquire new members',
      content: () => (
        <>
          Understanding how members shop your discounts provides valuable insights. It means we can
          target new audiences that aren’t shopping your brand and convert them into new customers.
        </>
      ),
    },
    {
      image: '/assets/verify/verify-illo-loyalty.svg',
      title: 'Increase customer loyalty',
      content: () => (
        <>
          By using <span className="font-extrabold">Verify</span> you can build customer loyalty by
          providing offer exclusivity and easy, seamless transactions.
        </>
      ),
    },
    {
      image: '/assets/verify/verify-illo-reduce.svg',
      title: 'Reduce discount abuse',
      content: () => (
        <>
          <span className="font-extrabold">Verify</span> seamlessly validates the eligibility of
          your customer as a Blue Light Card member, reducing fraud and protecting margins to
          increase ROI.
        </>
      ),
    },
    {
      image: '/assets/verify/verify-illo-codeless.svg',
      title: 'Codeless discounts',
      content: () => (
        <>
          Using <span className="font-extrabold">Verify</span> removes the need for online discount
          codes, improving the customer journey – while reducing cart abandonment – and allowing us
          to collect member-level transactional data.
        </>
      ),
    },
  ],
  instructionCards: [
    {
      image: '/assets/verify/verify-tick.svg',
      title: '1',
      content: () => (
        <>
          Integrate your app, website or till point with{' '}
          <span className="font-extrabold">Verify</span> using the ready-to-use API supplied by Blue
          Light Card.
        </>
      ),
    },
    {
      image: '/assets/verify/verify-tick.svg',
      title: '2',
      content: () => <>Blue Light Card member downloads and registers with your app.</>,
    },
    {
      image: '/assets/verify/verify-tick.svg',
      title: '3',
      content: () => (
        <>
          Blue Light Card member links their account to your app or website using their unique
          membership number.
        </>
      ),
    },
    {
      image: '/assets/verify/verify-tick.svg',
      title: '4',
      content: () => <>API call is made to check member eligibility with a true/false answer</>,
    },
    {
      image: '/assets/verify/verify-tick.svg',
      title: '5',
      content: () => (
        <>
          If the member is eligible a digital voucher is created in your app with a unique QR code.
        </>
      ),
    },
    {
      image: '/assets/verify/verify-tick.svg',
      title: '6',
      content: () => (
        <>
          This QR code is scanned each time a purchase is made in-store, to apply the discount and
          re-verify the member. The transactional data is returned to Blue Light Card.
        </>
      ),
    },
  ],
};

export default verifyPageData;
