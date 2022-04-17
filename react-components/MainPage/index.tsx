import client from '@lib/api/client';
import fetcher from '@lib/api/fetcher';
import useSWR from 'swr';

const MainPage = () => {
  const { data: lessonData } = useSWR('/main', fetcher);

  return (
    <div>
      <div className="carousel w-full">
        <div id="slide1" className="carousel-item relative w-full">
          <img
            src="https://images.unsplash.com/source-404?fit=crop&fm=jpg&h=800&q=60&w=1200"
            className="max-w-sm rounded-lg shadow-2xl pr-4"
          />
          <div>
            <h1 className="text-5xl font-bold">왕초보를 위한 레슨</h1>
            <p className="py-6">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In
              deleniti eaque aut repudiandae et a id nisi.
            </p>
            <button className="btn btn-primary">Get Started</button>
          </div>
          <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide4" className="btn btn-circle opacity-50">
              ❮
            </a>
            <a href="#slide2" className="btn btn-circle opacity-50">
              ❯
            </a>
          </div>
        </div>
        <div id="slide2" className="carousel-item relative w-full">
          <img
            src="https://api.lorem.space/image/car?w=800&h=200&hash=500B67FB"
            className="max-w-sm rounded-lg shadow-2xl pr-4"
          />
        </div>
      </div>
      <div className="flex justify-center w-full py-2 gap-2">
        <a href="#slide1" className="btn btn-xs">
          1
        </a>
        <a href="#slide2" className="btn btn-xs">
          2
        </a>
        <a href="#slide3" className="btn btn-xs">
          3
        </a>
        <a href="#slide4" className="btn btn-xs">
          4
        </a>
      </div>
      <hr />
      <br />
      <h1 className="text-2xl font-bold">초보들을 위한 레슨!</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="card bg-base-100 shadow-xl">
          <figure>
            <img src="https://api.lorem.space/image/shoes?w=400&h=225" alt="Shoes" />
          </figure>
          <div className="card-body">
            <h2 className="card-title">
              Shoes!
              <div className="badge badge-secondary">NEW</div>
            </h2>
            <p>If a dog chews shoes whose shoes does he choose?</p>
            <div className="card-actions justify-end">
              <div className="badge badge-outline">Fashion</div>
              <div className="badge badge-outline">Products</div>
            </div>
          </div>
        </div>

        <div className="card  bg-base-100 shadow-xl">
          <figure>
            <img src="https://api.lorem.space/image/shoes?w=400&h=225" alt="Shoes" />
          </figure>
          <div className="card-body">
            <h2 className="card-title">
              Shoes!
              {/* <div className="badge badge-secondary">NEW</div> */}
            </h2>
            <p>If a dog chews shoes whose shoes does he choose?</p>
            <div className="card-actions justify-end">
              <div className="badge badge-outline">Fashion</div>
              <div className="badge badge-outline">Products</div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <figure>
            <img src="https://api.lorem.space/image/shoes?w=400&h=225" alt="Shoes" />
          </figure>
          <div className="card-body">
            <h2 className="card-title">
              Shoes!
              {/* <div className="badge badge-secondary">NEW</div> */}
            </h2>
            <p>If a dog chews shoes whose shoes does he choose?</p>
            <div className="card-actions justify-end">
              <div className="badge badge-outline">Fashion</div>
              <div className="badge badge-outline">Products</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
