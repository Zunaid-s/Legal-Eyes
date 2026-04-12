export default function Contact() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold text-secondary">Contact Us</h1>
        </div>
        <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100 p-5">
          <form className="card-body">
            <div className="form-control">
              <label className="label"><span className="label-text">Email</span></label>
              <input type="email" placeholder="email" className="input input-bordered" required />
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-secondary">Send Message</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}