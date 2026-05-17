import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faStar } from '@fortawesome/free-solid-svg-icons';


const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/products/getbyid/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.log(err));
  }, [id]);
  const handleDownload = async () => {
  const res = await fetch(`/api/download/${repoName}`, {
    headers: {
      "auth-token": localStorage.getItem("token")
    }
  });

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${repoName}.zip`;
  a.click();
};

  if (!product) return <div className="text-center mt-5">Loading...</div>;
  const rating = 2;
  return (
    <div className="container my-5">
      <div className="row">
        {/* LEFT SIDE */}
        <div className="col-lg-8">
          <div className="card shadow-sm p-4 py-5">

            {/* Title + Price */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h3>{product.title}</h3>
                <small className="text-muted">
                  by DevMaster | {product.totalReviews} Reviews
                </small>
              </div>
              <h4 className="text-primary">${product.price}</h4>
            </div>

            {/* Image */}
            <img
              src={product.images[0]}
              alt="product"
              className="img-fluid rounded mb-3"
            />

            {/* Preview Button */}
            <div className="text-center mb-4">
              <a
                href={product.previewLink}
                target="_blank"
                rel="noreferrer"
                className="btn"
                style={{ backgroundColor: "#8682fa" }}
              >
                Live Preview
              </a>
            </div>
            <hr />
            {/* Description */}
            <h5>Description</h5>
            <p className="text-muted">{product.description}</p>

            {/* Features */}
            <div className="row">
              {product.features.map((feature, i) => (
                <div className="col-md-6 mb-2" key={i}>
                  <i className="fas fa-check text-success me-2"><FontAwesomeIcon icon={faCheck} /></i>
                  {feature}
                </div>
              ))}
            </div>

            {/* Gallery */}
            <div className="row mt-4">
              {product.images.map((img, i) => (
                <div className="col-md-6" key={i}>
                  <img src={img} className="img-fluid rounded" />
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-lg-4">
          <div className="card shadow-sm p-3 py-4">

            {/* Buy Button */}
            <button className="btn w-100 mb-3" style={{ backgroundColor: "#8682fa" }} onClick={() => handleDownload }>
              Buy Now
            </button>

            {/* Built With */}
            <h6>Built with</h6>
            <p>
              {product.builtWith.map((item, i) => (
                <span key={i} className="badge bg-light text-dark me-2">
                  {item}
                </span>
              ))}
            </p>

            <hr />

            {/* Tags */}
            <h6>Tags</h6>
            <p>
              {product.tags.map((tag, i) => (
                <span key={i} className="badge bg-secondary me-2">
                  {tag}
                </span>
              ))}
            </p>

            <hr />

            {/* Info */}
            <p>
              <strong>Uploaded At:</strong>{" "}
              {new Date(product.createdAt).toDateString()}
            </p>
            <p>
              <strong>Last Updated:</strong>{" "}
              {new Date(product.updatedAt).toDateString()}
            </p>

            <hr />

            <p>
              <strong>Documentation:</strong>{" "}
              {product.documentation ? "Documantation Included" : "No Documantation"}
            </p>

            <hr />

            <p>
              <strong>Support:</strong> {product.support}
            </p>

            <hr />

            {/* Rating */}
            <div className="mt-3">
              <h6>Reviews</h6>
              <h4>
                {product.rating}{" "}
                {/* <i className="fas fa-star text-warning"><FontAwesomeIcon icon={faStar} /></i> */}
                {[1, 2, 3, 4, 5].map((star) => (
                  <FontAwesomeIcon
                    key={star}
                    icon={faStar}
                    className={star <= product.rating ? "text-warning" : "text-secondary"}
                    // className={"text-warning"}
                  />
                ))}
              </h4>
            </div>
                <hr/>
            {/* Rating */}
            <div className="mt-3">
              <h6>Comments (0)</h6>
              <h4>
                {product.comments}{" "}
                <i className="fas fa-star text-warning"></i>
              </h4>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;