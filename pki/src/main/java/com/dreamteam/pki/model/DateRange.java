package com.dreamteam.pki.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

@Data
@Embeddable
@NoArgsConstructor
public class DateRange {
    @Column(name = "start_date")
    private Date startDate;

    @Column(name = "end_date")
    private Date endDate;

    public DateRange(Date startDate, Date endDate) {
        this.startDate = startDate;
        this.endDate = endDate;
    }
    public static DateRange Create(Date startDate, Date endDate) {
        if(startDate.after(endDate)) return null;
        return new DateRange(startDate, endDate);
    }

    public boolean isExpired() {
        return (new Date()).after(endDate);
    }

    public boolean isValid() {
        return startDate.before(endDate);
    }
}
