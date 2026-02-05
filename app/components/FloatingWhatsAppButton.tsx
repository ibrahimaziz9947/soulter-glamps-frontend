export default function FloatingWhatsAppButton() {
  const number = '923395069280'
  const message = 'Hi Soulter Glamps! I want to book a glamp. Please guide me.'
  const href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`
  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="block w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#25D366] shadow-lg hover:shadow-xl hover:scale-105 transition-transform transition-shadow duration-200 flex items-center justify-center"
      >
        <svg
          viewBox="0 0 32 32"
          className="w-6 h-6 md:w-7 md:h-7 text-white"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M16.003 3C9.373 3 4 8.373 4 15.003c0 2.533.79 4.89 2.144 6.839L4.5 28l6.302-1.622A11.94 11.94 0 0 0 16.003 27C22.633 27 28 21.627 28 14.997 28 8.373 22.633 3 16.003 3Zm0 21.826c-2.036 0-3.929-.593-5.523-1.613l-.395-.25-3.744.964.999-3.647-.257-.398A10.01 10.01 0 0 1 6.174 15c0-5.409 4.42-9.826 9.829-9.826 5.405 0 9.826 4.417 9.826 9.826 0 5.409-4.421 9.826-9.826 9.826Zm5.542-7.34c-.304-.152-1.79-.885-2.067-.984-.276-.1-.478-.152-.68.152-.203.304-.78.984-.956 1.188-.175.203-.351.229-.655.076-.304-.152-1.285-.472-2.446-1.505-.904-.807-1.513-1.803-1.689-2.107-.175-.304-.019-.469.133-.621.137-.137.304-.351.456-.527.152-.175.203-.304.304-.507.1-.203.05-.381-.025-.533-.076-.152-.68-1.64-.931-2.246-.245-.594-.493-.51-.68-.51-.175 0-.381-.025-.582-.025-.203 0-.533.076-.807.381-.276.304-1.06 1.036-1.06 2.527 0 1.491 1.085 2.935 1.237 3.139.152.203 2.132 3.252 5.165 4.423.722.312 1.288.498 1.727.637.725.23 1.387.197 1.91.12.582-.088 1.79-.729 2.041-1.433.252-.704.252-1.307.176-1.433-.076-.126-.276-.203-.58-.355Z" />
        </svg>
      </a>
    </div>
  )
}
