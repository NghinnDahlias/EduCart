"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";

const products = [
    {
        id: 1,
        title: "Calculus: Early Transcendentals",
        author: "James Stewart",
        price: "125.000₫",
        originalPrice: "250.000₫",
        tag: "BÁN",
        category: "CALCULUS",
        image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExIVFRUXFhgXFRcXFxgYFxUXFxcXFhoXFRcYHSggGB0lGxUXITEhJSkrLi4uGCAzODMtNygtLisBCgoKDg0OGxAQGy0lHyU1LS0tLS0tLS0tLS0tLS0tLS0tLS01LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAP4AxgMBEQACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAAAgQFBgcDAQj/xABFEAACAQIDAwUMBwgCAgMAAAABAgADEQQSIQUGMRMiQVGxBzM0UmFxcoGRkqHSIzJCU4Ky0RQWYnOiweHwFUMkwiUmdf/EABsBAQACAwEBAAAAAAAAAAAAAAACAwEEBQYH/8QAMxEAAgECAgYIBwEBAQEAAAAAAAECAxEEIQUSMTNRgRU0QWFxocHREyIyUpGx8BRCI2L/2gAMAwEAAhEDEQA/AG09gfPAgBACAEAIAQAgBALf3MfCan8o/nWcvSn0LxO7oPeS8PU0ucM9MF4AQAgBACAEAZ7a8Hrfyqn5DLKW8j4oqr7qXg/0YgvCesR4F7T2AEAIAQAgBACAeEzF0ZUW9iDMOsRrLiZ1JcGGYdYjWXEakuDDMOsRrLiNSXBhmHWI1lxGpLgwzDrEay4jUlwYZh1iNZcRqS4MMw6xGsuI1JcGW/uYH/yan8k/nWcvSjWovE7mhE1Ulfh6l72/jlpUSS1RS5FNDSTPUD1OapRbEEgm+otp08JxoRuz0c5KKuzg9F6Ko7M1eqqCmWyhTUY/aYKLLr1CW0/n+TYtprV//N/FSbeyyFVsVVfE8ijCmEpJVYsuY1M7uuVTmAAXkzm498TUdNVla5s3bZEnbeJCo4TPfE1EKlQC9GmtcnkcrEl7UwRmAuRbS9xLVRHWYnC7yPUzOKiCkimoWSmahqU2xGIpo1r81AlAXIuSW6LanCwU7i6u8zmpWpqaY+kp06DMGsL1lw9UuNM2WoRYAi+dRcXvChsGsOcLtOq1alTBZharyp5JVIKNTADAtoLPxUG+nCYaVrmbu9iV214PW/lVPyGZpfXHxRGvu5eD/RiCsLcRPVay4nhHCXA9zDrEzrLiY1JcGGYdYjWXEakuDDMOsRrLiNSXBhmHWI1lxGpLgz0GZuRaa2hACAZ5v/4SP5a9rTz+k99yR63QvVub9CtTnnWCAEAIAQAgBALj3K97V2bjhWqAmk6GlVy6lVYqwcDpsyj1EwD6CXulbJdbjH0gCOnOpF/IVBBgMj8NvjsteSP/ACwJprlPONqg1+uLanXj5JfKsmpLVWfl4GpHCtShLXl8uXc/Ed4vfnYlUqamKw1QoboXXMVOmq3XTgOHUJSm1sNppM8ob77EQlkxOFUli5KqAS5zAsSF+sQza8eceuG2xZCK2+Owmy5q+EbISUugOUs2dit10uwBPWReNZ8Rqo6Vd+NiMuVsThWXKy5Stxle2ZbFbWNhcdNouxZHKnvhsJchWvhAUJNOyAZCxBYpzeaSQCbcbRrN9o1UQHdG7rGBGErUMLV5etVptTBUMEphwVLlyACQCbAX1te0wZPnWAEAIAQAgGl7k+CJ6T/mM9Fo7cLmeQ0x1p+CJ2bxywgGeb/+Ej+Wva08/pPfcl6nrNC9W5v0K1OedcIAQAgBACAEAIAQAgBACAEAIAQAgBACAOFwFUi4pVCOsI36QDg6kGxBBHEHQwDyAaXuT4InpP8AmM9Fo7cLmeQ0x1p+CJ2bxywgGeb/APhI/lr2tPP6T33Jep6zQvVub9CtTnnXCAEAIAQAgBACAEAIAQAgBACAEAIBc90Nw6mJAqVb06R1A+046xf6o8vT8ZkGtbu7p4SjYJTQHrtdj52OpgwXKlu3TI4CLmSu73bjUatMhkB00PSPKp4iAfN+2tnnD16lEm+RrX6wdQfYRMAv25Pgiek/5jPRaO3C5nkNMdafgidm8csIBR99sGGrBs1uYotbytONj6OtUvfsR6jQ9S2Ht3v0KpyYvbWc/wCD3nZ1sh3h9nBvtEeqTWHT7SuVW3YPRsEfeH3f8y3/ABr7il4p8Dou7YP/AGH3R+sksAn/ANeRF4z/AOfMQd3x94fd/wAyLwS4kli+4P3fH3h93/Mf41xH+vuPV3eBHfDx8X/MysEmvqMPFvgcK+xgt+eT6v8AMrlhUu0tjXb7BocD/F8JX8DvLPiD7DbBDpm5QjS/1fNpx8sujg1LtKZ4jVewV/wA+8Puj9Zn/EuJH/V3Hh2APvD7v+Zh4NcSX+nuFJsAH/sPu/5klgk/+vIi8W12CRsEfeH3f8yP+NcTP+rLYIfYYH2z7v8AmYeEt2mY4m/YWncLcYV6oqPdqaHgRo7Dr6wOrp9soqU1B2uXQm5Z2NG3w2kMJRypbOeavSL24kdQ4xSpubsKk1BXMu2ZtHE0sQtc4qo1mBdSTlZb84Zb2GnDTSXvC95V/p7j6R3bxwqUwb9E02bJ129iVWmbmED5g3wwwrYutUDaFrDTxQFPTrqDNhYe6TbKXVztYsO6NPLhlF72Z/zGdzAx1aKXieV0s74lvuX6JmbZzAgFO3y75+AdpnLxv1npdEbjmyoLxmgjsvYSmAlsSqZMJNmJqSQ5RpcihoQ6SMokkxDSJIVbSZtkYvmMMWtprTVjag7jVxoJHsLFtH2xan0ZHn/vLqTyKayzHFtZO1mVN3QoLJWug2JzSN7DVueAXmFmHkdaGENWotNfrMbebrPqGvqkKrUVclSTk7I3Pd7ZS4bDiwsAuk5TbbuzppWVjJN+NomtiWF9E5o851P9h6pv4aFoX4mlXleVuBXm4S57CpbS67q778ggR780WBGtwOF/LNOph23eJtQrJKzEby7/ALVgUpBhf7R0t5h1+eYhQd/mJTrZfKUWudJtSNeBad1vB19JvzGdLCbr8nndK9Yfgv0S02TmhAKfvgv0g9AdpnLxi+c9Loh/+HNlQH1ppHZewlMJ0SaKZEtRM2IGtMcrL0UHsyYEOJFokmILSFyVjjiE5shNZFsHmRtS9/XNd3NhDrZDafiI7JZTdiFRXY/E2O01j0cbmZW0PZYQyayElmSTyBIRGRd+5nsflKpqkXtzV7WPYPUZo4yeeqbeFjtkaVvZihRw7dACkn1C800rs227Znz49QsSx4sSx85Nz2zrRVlZHNbu7iGmWFkeqsJGG7CHp6yLjmSUlYRXTSJRyJQeZZt1/Bx6TfmnQwm7/J53SvWH4L9EtNk5wQCo73n6T8A7WnMxn1npdE7jmymk86aLeZ2uwlMC0nFlMiUAlxrscU6kujIqlE6Aydyto8rNMTZKKOKnUSpPMm1kJqtEnwJQQwqjWUNZl6HGyqfNPpfpJwj8pGpL5h0plqZS0LPCT2ox2iSZEykeeb1CY2GGjdu57snkqKi2oGvnOpPtvONUnrSbOpCOrFIgu63tC1Epf6xC+3U/AGWYeN5ohWdoGQzpGieZZiwuLpCTiiMmmOFEtSKmNsYJVVRdRZYN1/Bx6TfmM3MJu/ycLSvWH4L9EtNk5oQCm75d9/AO1pysZvD02iNxzfoU88Zz75na7CVwAl8SiRL0xNiKNWTOgWSsRvkLk+whtEOZGTuSijirSpMtaEu8w2ZSGdepzvXK5SzLooebIPMv5T2iW0/pKav1DnJpeW27SvW7BVLUyUM2JbBdWnYXEzKNlcgpXH+7WD5XEUh0XzH8Oo+NprYiWrSvxLaK1qiR9CbLo5KXqnIOmYz3VMZmrInVdj2D+83cLHazVxDzSKbSWb8UjSkz0LczNrsxeyFNTk3Ejc60RJxIsa4yVVS+kT27PeB6Tdpm1hd2cLSvWH4IlZsHOCAUvfTvv4B2tOVjd4en0RuOb9CoDjOetp2ewl8CsviiiTJem2k2YvI1ZLMVeZI2yF9EltRFZM5O1hK28ixK7OSaSCJvM51DItkkhpVkGWxJHYw+jH+8Wl9L6TXqfUOBVsLSzWsrFbjfNCA1phOxLah1QcHQy6MkymSLn3M8BmrO9tBZR2ntE52PlZqK8TcwcdsuRsOPbJS9U5xvHzvvjieUxVQ9RCj1a9pM6dCNqaNCtK9RkMray5PMpayHVM2l8cil5iiZMieK8wmZZwxgldVF1Jk9u13gek3bNrC7s4elOsPwRKTYOcEApe+vffwDtacrG7w9Pojcc36FP6Zzu07JLbPaXxZRNE/szBVa9RaNCm1Wo1yFW3AcSSSAo1GpIGolrnGKzKFByeRLba3Px2ETla+HIp6XdWVwt/Hym6+e1teMjGvCTsiUqMoq7IPNLr2KbEzsvczH4qly1DDFqf2SzInKW8QOwJHl0B6DNepXgnY2IUZNXIOpSZWZHUoykqysCGVgdQQeEsi7q6ISVnY6YTZdastZ6NPOtCmatY5kXJTAYlrMQW0VtBc6SEpJOxZGLZD1m7D2SLJpEzsTBVaxSjRptUqMNFUa6C5JJ0A1GpIEs11GN2VarlJ2Jva+5mOwqcrXwxFMC7MrI4T0wpJHntbyzFOvCUrGJ0pKJA1TLZcSuPAfbT2dWwlXksRT5OoApy5lbRr2N0JHR1xTqxa1kJ02nZmwdzzY1Sh9HWTJUHOZbq1s2o1QkcJzcRUVSbkjeow1IWLDvTiWFNwq3CJnc3AyrY66nXgeEpRafOmJqZ3Z/GYt7STOuo2SRzHK7uOMPsys1CpiVp3oU3WnUfMoyu2QAZScx74uoBGvnhVEpavaw6cnG6Fps6s1B8StO9Cm6pUfMoyuxQAZScxvyi6gdMm6sVLU7SEaUmtYbISSAASSQFABJJJsAANSSbaSWskszGrd5FnfufbTVOUOFv05BUplwPRza+YEnyShYunfaWvCzsVbEg8CCCNCCLEEaEEHhNiXzIrgrMn93O8D0m7Zt4b6DhaT378EScvOeEApW+p+lHoDtacrG7w9Pojq/N+hUgbmaGbZ2diJHBiWIpZqm4Nd8PsfaWKw4/8AJV1TNYEpSC0yXAPiipVf8PklNTOaT2E4ZRuioDb2KKPTOMrslUWqK9VnDi4P2ySLmwNrXGh0NptfDhdOxrupJ5Edi25jW6FPZJ3IxWZtG/W7m1alegdn1OToUKNMU1Wtyaiopa+ZBo4yhBY3FgR0m/OhKFnrG608rFP7slFV2oxAAL0KTtbpa7pc/hRR6ps4b6CivtRw7nvg22f/AM9vyV5Gt9USylsM9q6iw4mw9suaK0zVe59UahszaeJw4/8AJQKqmwJSmFBzgHqzVG8vJi97SitnOMXsJUvpbW0pw2/iclRDjK7rVXLUVqrOHUkXvmJtfhcWuDbgbTZ+FBWsjX+LNrMY1jZfJLJ/SRh9Rdu7ApO1SvS1KgFHXdmUW69dJqYd/wDm+ZsVk9dWNnwyf+VWP8Kdk0TaIPe6r9BtLyYNvyVZZTV5pd5GWxmB07WnZSyOU2W/ZI/+A2j5MXRJ82bC6/Cac8sQr/203Ibl2DZY/wDr+P8ALjKNvKQ2FJtE+sR8PcQdqLK5sTaP7NiKOIyhuScOVOlwOIv0GxNj12l9SGvFxKIS1ZJmgvSwu08QcRs/alfDYxgG5CozKCVXVVUHUWGuUuvHSaFnTynG6N3Ka+VmZ4qi1NnpuLPTd6bi97MjFW16dQdZ0oyTimjQcWpO5P7u94HpN2zew/0HA0nv34Ik5ec8IBSt9R9KPQHa05WN3h6fRHV+b9Cprxmgtp2HsJXAy2JRItO6e8tfAVjUo5WVwFq03+rUUXtqNVYXNj5ToYqUlMxCpqkxtvfZatGrQw+zsNhBWsKzoFd3F76WpoAbj6xuRxFjqMRw9pXbvYzKsmskU+tTzKV6wR7ZsWKU7O5P74b2V8bW5VWqYb6NaYSnWcrdSxzmwXU5hpboE140IxVnmXOs3mjlvhvC2PxH7Q1IUjyS08ocvopZr5io8fhbok6dPUViM567Pd0N6v8Aj2rk4ZcStemtN0d8q5QWuCMjBgQ9iDIVaetYspzsct595qONNFKez6GEyOWY0it3FtA2WmugPnijTalm7mak1qsdbsbwV8BW5WjY5gFqI31aijnWNtQRmNj0XPEEg3VKKqZM14VXAk9tb7ipRq0sPs3C4TlhlrVECu7qdTa1NLG+tze3EWOorjhnFpt3sWSrpqyRTyOg8JeUmkbp761Kz0KVbA0MTWoi1LEuRylMCwBIKMc3C5DLeaNaioJyT5G3Sq62VjWNkUWVGdzd3OZj5eoeQCwHmmoXlG3u3qGDqPfDpiBXApsjtlXKoa9xkbMDmtYiX0aXxHttYqq1FBZmeby7cp4rk+TwNHCZM1+SK/SZsts1qa8Mp6/rGdKjRlC93c0a1WM7WQndbeSpgnqZaaVqVVctahU+q4F7EGxynUjgQQbEcLYrYdVO5ijX1Muwcbzb2NiqVPD08PSwmGptmFGlqC2urEKotqTYLxNzfS2KeH1HrN3ZKpX11qpZEBgMW1GrTqoFLU3V1DAlSVNxmAIuLjrElKOsnEjF2akW6h3QKdNjVo7IwlHEkG1dSNCRYtkFMHW5vzhfrmt/mbycsjZ/0K2SKPiXZmZ3bMzszuxtdmYlmY26ySfXNhR1ckU62tmWTdzvA9Ju2dHDfQec0n1h+CJOXnPCAUzfXvg9AdrTlY36z02iNxzZUBxmgtp2XsJPBmWIpkWfZWzalRAy0kcNWFFcxYHlCobLZWGlje565brJdveUuLdrDxtiVgMxw9MDlWo/XfviBiR3zhZW18kKouPeZcHwOH7Eb0voqP0wBpnO9iCQASeU5ozXXXpVh0GTbWbu8iuzyXHx9xx/wVY5SKFJg9U0lIdyC65r/wDZwsjG/k8ovBzjxfEmoS/riTsKtzb4emM1RqIJd7copqBl75x+ifz6WuSJhzXHvMqD4DMbIqOVUUKOZlqMFNR8wWnmzMy8pcD6N7deWRlJWvcsUWL2dsKsSjnDUgHpB6ZNRxnVuS+rerxJrooHG5I6JmEo3ef9+O4VE7JD5tlVSCwoUyBRGIPOfSkwZg1uU10Q6CXa6T29tjX1G+zvPX2Q+WowpUmWklN3Ku7ALVGZDcVOlRfzSWvF2zefoRcZLOyy8Rri8A1NC7UaWUVGpGzVDZ0vcG1TTgfZfhaRyex95l3W1d3aW/uWIrO5yBSGHC/C2n1iT1zRxSd1c3MO1Zmy1dEPmmobBhfdAxd8VlKq2Vb65tMx/hYeKJ08FD5WzQxcvmSK0Ky/dp7anzzeSfH9expvw/fuBqr90ntqfPDT4/r2F+79+4k1l+6T21PnmLd/6Mrw/fuc+VX7pPbU+eV27yxPK1v37hyq/dJ7anzxq9/6F+79+43xJvrYDyC9viSfjDWRKDzLBu13gek3bNzDbs4OlOsPwRKTYOcEApW+vfR6A7WnKxu85Hp9EdX5v0KkOM0UdjsJHBpJxKpMnMPiCBl5WqozZgqarmtYNbOOda4vbh0ybWewqvkOBjCDpiMQCGzaCxDa87vv1tTrx1MzbssjF+8Sa6m16lUkaglRcaltDymnOJPnJMnrO1rIhqq9zouJFrctWtcm1tLm9zblP4m949Zjb2IfkP22xuK9cG+a4GubnHMDyvHnvr/G3WY8UjKT7xk20CLAYnEjLmItplz3z5fpdM1ze3G+spa7kXoebJq2TSvXF1I4W5jBVy2FX6uVF04WUdQl8I5bEVVJZ7R3yubTlq31coFtAgBGQfSfVszC3DnHrMt1O5GtreJzSqACOVq2IAPNGoUZQD9JqANB1CZV+CDse4rF5xZ69d7nNzudzrWza1ONtLyLVtiX9yJJ32tmidyfBjKXW5DMdSADppwBPSDObipXnbgb2GVo34mmbUrhKZ801TYMF3nxdKrXZsx00uqhgbE9bDhczr4SE408+3M5uJnGU8iGtT8Z/cX55s3Zr5CitPxn9xfnmXrGMhBWn4z+4vzyPzEshGSn4z+4vzyFmTTQumlPxn9xfnk46xGVhriwBe17eUWPsue2YlsJQJ7drvA9JvzGbWG3Zw9KdYfgv0Sk2DnBAKXvp338A7WnKxu8PT6I6vzfoVG+s0L5nZ7B/gyZYiqSJW9tZbexRa4ZrnWL3Zm1hQmSJ7YzNmDjVqSLZNIalc5C9Zt6uJkUruxZeyuTF7Cw/wB/3T2y+/YazFUXtJwdiqaOme/RJ61yFrHNxItdhJPtN07m+ByUEHTlF/PbX4zi1XrTbOrTWrFIeb+Y7k6DtfgpPsF5GCu7EpOyuYFSfr4zvQZx5I6Kt5NIgwdYaCEFZFoymeOsw1kZTBXtClYk1cbYl9LSqcuwupx7SxbseDj0m7ZuYXdnn9K9Yfgv0Ss2TnBAKVvp34egva05WN3nI9Pojq/N+hUiNZoNZnY7CRwYEsRVIki46JY2VJApgWFyWRE9ZxwkrrYEntGdZhK3Yuimd9mUuL+pfN1+sycNlyM32DtjrJFLBZlEGdElkSDHODoZ6qL4zKD5idfheYqvVi5GaavJRPondqhlpDzThs65Su6xjLUWXxiF9p1+F5fho3qIpxDtBmRIZ1Y5HOlmdgbaiW7Cux7mmbmLCs0zcwJqTEjK2jcyhl6G1c6SuRdFFn3aH0A9Ju2dDC7s85pXrD8ESk2DnBAKbvkv0v4B2tOVjN4em0RuOb9CodM0e07PYSGE65NFTHxkyAnP1TFxY9Z+uS2bTFji9WRuSseUqWdre09Q6vOZlLWZlvVRK2sLD/f94e2WlJ7eSIBBjadKYlkCuRYdzcGXxSX4AFv7f3lOMbjT8S3CpOp4G/YJMtMeacc6ZjvdUxWaoieUsfULf+xm9go5tmni3kkUO06FjUHNJNJbFEGeVEtMtGDwCEYFVLQ2ZQ1veU7S5ZHCsNJXJFkWWTdo/QD0m7ZvYXdnntK9YfgiUmwc4IBT98e+/gHa05eM+s9Loncc36FO6Zodp2uwkMMZYipod5b2A4mSI97EvSdfsk+Ua9kWaMppnCsXP2T7DMTZlIXRwbHjp2+ofrCi3tMOaWwlEphALaW9vn88s8Cm982ecZkxcU3GSe0itgphMswh1gRzvbLqZVMvvc3weaqzdRCj1a/3E0dISzjHmbeCjk2a5jHy0z5pzTeMA30xXKYp+pQF9fE9s62Djanfic7EyvO3AggZsooHVF/JLUQZ5iW0iTyMLaIoi6nyTEdhmW05kgyJlCAJixK5wxPCVTLaZYd2O8D0m7ZuYXd/k4GlesPwRKzZOcEAqO+A+k/AO0zmYz6z0uiNzzZTRxM0FtO09g9pNJkGSGC1YnpFgPIOuThxK5okFSXqxru4o0bjj/eGrownZnNub55W00TTW1CL6R2GNrEZvJMXM2Ol5IiepJRMSHNN7ay6LKWjX+5hhfow9vrc728PhOTi561V/g6eGjami171YoJSOvRNZF588Yyvndn8ZifadJ3IrVio8Dkt60mzisyjDFhpJOxFo8ZobMHqGEzDPSJlhHOQuTG+Jlcy2mWPdjwcek35jN3C7s4GlesPwRKzZOcEAqW+H1/wDtM5uM+o9Jonc82UsHWc5POx2+wfUhLSA7wQIqedez/F5KCaZGecSZBPX/vGbEUa02JuekzJBiGNzIt3ZNLI8KCY1VsMZ7RJEizICALUaSSWRBvMUqEkAcSbDznh2zLyzMbT6F3KwYp0VHQFAHqE40nd3OqlZWK73T9pWpMgOrc0evj8Ly/C09eolwzKcRPVpsyU052tU5akcDoZU8mWXugGsLNmHkdMkssQuJK2kbWFwc6Q3kZW0VRUHjEVcNjbFLbSV1Mi6mWHdrvA9Ju2bmF3ZwdKdYfgiUmwc4IBUd8O+fgHa05mM+s9Lojcc36FLA505y+o7XYSmHE2CtnVWs6H+K3t0mU80Ya+Vkwh0/3yy6LzNeSyPCZlsrseIdTeI7cybvbIW6DjJOKIqT2DZzKWXJXPacRK5ZDhRLUipsk92cGamJpr0A5j6tR8bSnEPVpstoK80fQODtToeqck6RjW/u0xUr5b/V7T/jtnVwMLRcn2nOxk7tR4FbWb5pnGqmsrlG5JOxyEgibzQpTrJrJkGdaqaX6vhMyRhHCVkxVPrkomGcsYOMhULaRPbs94HpN2mbeF3f5OFpTrD8ESs2DnBAKZvpVAqWJF8g0v5WnKxskp5s9PohN0Ob9CoKwvxnPUle9zsNOxI4asvSwHrEvjUjxIOLFVqy3FmX6y9Ihzhfagk7EquMp/eJx8YSxVYX2opcHbYeftlP7xPeEz8WF9q/JW6cuAtsXSt3xPLzhJupTt9S/JiManASMbT+8T3h+siqsPuX5Jakr7Dm2Jp374nvCRc4X2r8lijK2w6piqQPfE94frJRqU0/qX5KpQm+xjlsfRtpUp39Jf1lzrU/uX5KVSqcH+C79y3BipUaqCGAIUEWPlOo9U0MXUUrRi7m5habjds0LfTbC4egxZgAq662mlFXZtN2RguI2kjsWaql2JJ546fXOxGdOKSUll3nOlCbbdmLpY+kP+2n7w/WXKvT+5fkpdKfBntXH0fvU95f1h1qX3L8mPhVOD/A0/bqf3ie8JR8aH3L8lvwp8GC46n94nvCZVeH3L8mHSnwZ3o4+lfWonluw/WTVen9y/JD4U+DEVcZSBtyqEekv6yLq0/uX5JKlPgxNPG0/vU94frEatP7l+TLpT4M5YrGUyO+J7wkalWD/6X5J06cl2Ms27DA4cEEEZm4eeb2EadPI8/pXrD8ESs2TnBAM83/8ACR/LXtaef0nvuS9T1mherc36FanPOuEAIAQAgBAJjdjd+pjavJpoBq7WuFB4adJPV5IBqVLuQURT15Qm3HNY+oAWmQZZvTsJsHXNIm4tmQ9am418oIImARKqSbAXJ0AHTAPpbud7KGDwaK2hC3b0jq3xJmQZj3YN6eWq/syNzVN6nlb7K+rifV1QwZtMAIAQAgBACAEAIAQDS9yfBE9J/wAxnotHbhczyGmOtPwROzeOWEAzzf8A8JH8te1p5/Se+5L1PWaF6tzfoVqc864QAgBACAEA3HuGbPTkM/S7sT6jlA+HxmQbYaIy2tMAw/u1bq1KgStRQuyEhlUXJVragDU2IGg6zMgqXc83OqNWWviEKIhuiuLFmHAkHUAcfPaAXLugb6rhaXI0iDVYc0eKOGdvJ1dftgwYfUcsSSSSSSSdSSdSSZgyJgBACAEAIAQAgBACAaXuT4InpP8AmM9Fo7cLmeQ0x1p+CJ2bxywgGeb/APhI/lr2tPP6T33Jep6zQvVub9CtTnnXCAEAIAQAgGhdy7fJcITRqtlUm6MeAvxUno67+UzIN2we9tNlBDAjrBuIsCO25vRhwpLuijrYgD4wDKt6O6QgumFGZuGciyDzDix+Hni4MyxOIao5d2LMxuSeJmAJpUyzBQLkmw85gC/2Wpa/JvbhfKbXy5re7r5tYB3w2y6rq7KmlNkWoWZVyGoxVc2Yi2oIJ4DptAHabsYskKtEsxaooCsjFmo25QKA3Otfo8vUYB5T3ZxTNTUUbmoaq0+cnONG/KAHNbSx89tLwBvR2awegKlstYqVyurEoXyE80kqbhhY2NwYBI7mboYnaVY0sOFAUZqlRzZKa9GYgEknoAHQegEgCZ3v7mWIwVD9qWtRxNAEB3pHVCTl5w6rkC4J1OoEA7bvdyPH4zDU8TSfDinUBKh3cNYMV1AQjiOuAVLePYlTBYmphqpU1KZAYoSV5yhhYkA8GHRALzuT4InpP+Yz0WjtwuZ5DTHWn4InZvHLCAZ5v/4SP5a9rTz+k99yXqes0L1bm/QrU551wgBACAEAIAQBdOqy/VYjzEjsgCWYk3JufLAPIAQBSOQbg2OvxFj8DAHmGr5g3K1nGhy6secQVu2h0toemx9UAWagCuFxL883cAOA+UuVLj7RJCEX4Z/JAHuDxNPUvi6yla4yWdwVpu1qtVbIczleOqHT7V7ABxgXwyrSBx1ZWSnXPMNQIlTORTFPmXVXTnHTW9jl6AGYWkK+DFKq1Tm0eUzX+jqGoS9NbqOaCb6XHOOsAsfcp3kw+HOJweKWoaGNRaTNSBLqwzqAFUFjcVDwBN7aG5gFx35w+D2Hs6tgMO9SrXxtiwqsCUpjQuVVQFvYqNLk3N+bYAOsMdnf8Fs3/kalZE+k5M0s1y2Z73ygm1oBju9Rw37VV/Y2dsPccmz3zkZVvfNr9a8Auu5Pgiek/wCYz0WjtwuZ5DTHWn4InZvHLCAZ5v8A+Ej+Wva08/pPfcl6nrNC9W5v0K1OedcIAQAgBACAEAIAQAgBAFU3sQeog+yAO6m0Sc16dPnEk6Hic+vHj9IbdVhAF4farI9OotOkDTcvouj5jco+uq25tuowB+d7a17hKQP7QuIBVStmRQgpgKwAp5Ra3HjrrAE4femsqIhSm+RKqZnDlmFZxUYuc3ONwfOGIbMDaAcDtY1a2GaoqIKK0qd1XLdKbfWfrax1PTYQBW6e3zgcQuJWjSqugOQVQxVGP2wFYXYC9r8L342IAb7f2zWxmIqYiu2apUNz1AcAqjoUCwA8kAum7vdexeDw1LCpQwzpSBCl1qFjdi2tnA6eqAU7eXbb43E1MTUVEeoQSqAhRZVXQEk8F64BeNyfBE9J/wAxnotHbhczyGmOtPwROzeOWEAzzf8A8JH8te1p5/Se+5L1PWaF6tzfoVqc864QAgBACAEAIAQAgBACAEAIAQAgBACAEAIAQAgGl7k+CJ6T/mM9Fo7cLmeQ0x1p+CJ2bxywgENtfduliH5R2qA5QvNKgWFz0qeuadfBQrS1pN8jo4XSdXDU9SCVtud/cZfuPh/Hre8nySnoulxfl7Gz07X+2Pn7h+4+H8et7yfJHRdLi/L2HTtf7Y+fuJbcrDD7Vb2qf/SYei6K7X5exlacxD/5j5+4n9zcN41f+n5Jjoyjxl/cjPTWI4R8/c9O5mG8av8A0/JHRlHjL+5DpvEcI+fuefuZhvGr/D5I6Mo8Zf3IdNYj7Y+fue/uZhvGr/0/JHRlHjL+5DprEcI+fueDczDeNX/p+SOjKPGX9yHTWI4R8/c9G5mG8av8Pkjoyjxl/ch03iPtj5+54NzMN41f+n5I6Mo8Zf3IPTWI4R8/c9/czDeNX+HyR0ZR4y/uQ6axHCPn7h+5mG8av8Pkjoyjxl/ch01iOEfP3D9zMN41f+n5I6Mo8Zf3IdN4j7Y+fueDczDeNX+HyR0ZR4y/uQ6axHCPn7h+5mG8av8AD5I6Mo8Zf3IdNYjhHz9z07mYbxq/9PyR0ZR4y/uQ6bxH2x8/cDuXhvGr+1fkjoyjxl5ew6bxHCPn7nn7mYbxq/8AT8kdGUeMvL2HTWI4R8/cWNyMP41b2p8kz0XR4vy9iL05X+2Pn7nv7j4fx63vJ8kz0XS4vy9h07X+2Pn7h+4+H8et7yfJHRdLi/L2HTtf7Y+fuTey9nrQpimhYqCTzrE6m/QBN2hRjRhqRObicTLEVPiSSv3DuWmuEAIAQAgBACAEAIAQAgBACAEAIAQAgBACAEAIAQAgBACAEA//2Q==",
        discount: "-50%"
    },
    {
        id: 2,
        title: "Nguyên lý Kinh tế học",
        author: "N. Gregory Mankiw",
        price: "25.000₫",
        originalPrice: "",
        tag: "THUÊ",
        category: "ECONOMICS",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs0OJ3hVCLQoOI3Td_7fU3TlNHW1U_H1oT2A&s",
        discount: ""
    },
    {
        id: 3,
        title: "Chemistry: A Molecular Approach",
        author: "Nivaldo Jr. Tro",
        price: "180.000₫",
        originalPrice: "",
        tag: "BÁN",
        category: "CHEMISTRY",
        image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&h=400&fit=crop",
        discount: ""
    },
    {
        id: 4,
        title: "Triết học Mác - Lênin",
        author: "NXB Lao động",
        price: "15.000₫",
        originalPrice: "30.000₫",
        tag: "THUÊ",
        category: "PHILOSOPHY",
        image: "https://images.sachquocgia.vn/Picture/2024/3/21/image-20240321142038119.jpg",
        discount: "-50%"
    }
];

export default function ProductSection() {
    const [activeFilter, setActiveFilter] = useState("ALL");
    const [favorites, setFavorites] = useState(new Set());

    const toggleFavorite = (productId: number) => {
        const newFavorites = new Set(favorites);
        if (newFavorites.has(productId)) {
            newFavorites.delete(productId);
        } else {
            newFavorites.add(productId);
        }
        setFavorites(newFavorites);
    };

    const filteredProducts = activeFilter === "ALL"
        ? products
        : products.filter(product => product.tag === activeFilter);
    return (
        <section className="py-16 bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header with Filters */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-blue-600 uppercase">Sản phẩm nổi bật</p>
                        <h2 className="mt-2 text-3xl font-bold text-gray-900">Sản phẩm nổi bật</h2>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveFilter("ALL")}
                            className={`rounded-full px-4 py-2 text-sm font-bold transition ${activeFilter === "ALL"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                        >
                            TẤT CẢ
                        </button>
                        <button
                            onClick={() => setActiveFilter("BÁN")}
                            className={`rounded-full px-4 py-2 text-sm font-bold transition ${activeFilter === "BÁN"
                                ? "bg-white text-blue-600 border-2 border-blue-600"
                                : "bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400"
                                }`}
                        >
                            BÁN
                        </button>
                        <button
                            onClick={() => setActiveFilter("THUÊ")}
                            className={`rounded-full px-4 py-2 text-sm font-bold transition ${activeFilter === "THUÊ"
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400"
                                }`}
                        >
                            THUÊ
                        </button>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {filteredProducts.map((product, index) => (
                        <Link key={product.id} href={`/products/${product.id}`}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group flex flex-col h-full rounded-2xl bg-white p-4 shadow-sm hover:shadow-lg transition cursor-pointer"
                            >
                                {/* Product Image */}
                                <div className="relative mb-4 overflow-hidden rounded-xl bg-gray-200">
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="h-48 w-full object-cover transition-transform group-hover:scale-110"
                                    />

                                    {/* Tag and Discount */}
                                    <div className="absolute right-3 top-3 flex flex-col gap-2">
                                        {product.tag && (
                                            <div className={`rounded-md px-3 py-1.5 text-xs font-bold text-white text-center min-w-[30px] ${product.tag === "BÁN" ? "bg-blue-600" : "bg-green-600"}`}>
                                                {product.tag}
                                            </div>
                                        )}
                                        {product.discount && (
                                            <div className="rounded-md bg-orange-500 px-3 py-1.5 text-xs font-bold text-white text-center min-w-[30px]">
                                                {product.discount}
                                            </div>
                                        )}
                                    </div>

                                    {/* Wishlist Button */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            toggleFavorite(product.id);
                                        }}
                                        className="absolute left-3 top-3 rounded-full bg-white p-2 shadow-md hover:bg-gray-100 transition"
                                    >
                                        <Heart
                                            className={`h-5 w-5 transition ${favorites.has(product.id)
                                                ? "fill-red-500 text-red-500"
                                                : "text-gray-400"
                                                }`}
                                        />
                                    </button>
                                </div>

                                {/* Product Info */}
                                <div className="mb-4 flex-1">
                                    <p className="text-xs text-gray-500">{product.category}</p>
                                    <h3 className="mt-1 font-semibold text-gray-900 line-clamp-2">{product.title}</h3>
                                    <p className="mt-1 text-sm text-gray-600">{product.author}</p>
                                </div>

                                {/* Price */}
                                <div className="mb-4">
                                    <p className="text-lg font-bold text-gray-900">{product.price}</p>
                                    {product.originalPrice && (
                                        <p className="text-sm text-gray-500 line-through">{product.originalPrice}</p>
                                    )}
                                </div>

                                {/* Add to Cart Button */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700 transition flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart className="h-4 w-4" />
                                    Thêm vào giỏ
                                </button>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
