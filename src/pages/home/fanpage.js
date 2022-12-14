/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState } from "react";
export default function FacePage(onReload) {
  const [fetchPage, setPage] = useState();
  useEffect(() => {
    setPage("https://www.facebook.com/AnousithExpress");
  }, [onReload]);
  return (
    <>
      {fetchPage ? (
        <>
          <div className="col-md-12 col-lg-3">
            <div className="rounded facebook-page mt-2" style={{ borderRadius: 5, zIndex: 0 }}>
              <div
                class="fb-page"
                data-href="https://www.facebook.com/AnousithExpress"
                data-tabs="timeline"
                data-width=""
                data-height=""
                data-small-header="true"
                data-adapt-container-width="true"
                data-hide-cover="true"
                data-show-facepile="true"
              >
                <blockquote cite="https://www.facebook.com/AnousithExpress" class="fb-xfbml-parse-ignore">
                  <a href="https://www.facebook.com/AnousithExpress" target="_blank">
                    ANS EXPRESS ອານຸສິດ ຂົນສົ່ງດ່ວນ
                  </a>
                </blockquote>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}